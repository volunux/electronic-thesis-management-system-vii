import ConfigurationProperties from '../../../config/ConfigurationProperties';
import QueryClient from '../../query/util/QueryClient';
import S3ObjectChange from '../../../helper/file/S3ObjectChange';
import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { UserHelper } from '../../../helper/entry/UserHelper';
import { UserService } from '../UserService';
import { UserRepository } from '../../repository/UserRepository';
import { UserRepositoryImpl } from '../../repository/impl/UserRepositoryImpl';
import { User } from '../../../entity/User';
import { Role } from '../../../entity/Role';
import { UserRole } from '../../../entity/UserRole';
import { Attachment } from '../../../entity/Attachment';
import { ObjectSweep } from '../../../entity/ObjectSweep';
import { ObjectSweepService } from '../ObjectSweepService';
import { ObjectSweepServiceImpl } from './ObjectSweepServiceImpl';
import { RoleService } from '../RoleService';
import { RoleServiceImpl } from './RoleServiceImpl';
import { CrudRepository } from '../../repository/generic/Repository';

export class UserServiceImpl extends AbstractBaseServiceImpl<User> implements UserService {

  protected readonly repository : UserRepository = new UserRepositoryImpl();
  protected readonly roleService : RoleService = new RoleServiceImpl();
  private readonly objectSweepService : ObjectSweepService = new ObjectSweepServiceImpl();
  private readonly eProps : ConfigurationProperties = ConfigurationProperties.getInstance();

  public async entryExists(id : string , userId? : number) : Promise<User | null> { return this.repository.entryExists(id , userId); } 

  public async findOne(id : string) : Promise<User | null> { let user : User | null = await this.repository.findOne(id);
    let roles : Role[] = [];
    if (user !== null) { roles = await this.roleService.findUserRoles(user!.getId());
      user.setRoles(roles); }
    return user;
  }

  public async findFullNameAndOthers(id : number) : Promise<User | null> {  return this.repository.findFullNameAndOthers(id); }

  public async save(entry : User) : Promise<User | null> { UserHelper.setPassword(<User>entry);
    let user : User | null = await this.repository.save(entry);
    if (user !== null) (<User>user).setPassword(entry.getPassword());
    return user;
  }

  public async updateStatus(id : number, status : string) : Promise<boolean> { return this.repository.updateStatus(id , status); }

  public async updateOneRole(id : number) : Promise<User | null> { let user : User | null = await this.repository.updateOneRole(id);
    let roles : Role[] = [];
    if (user !== null) { roles = await this.roleService.findUserRoles(user.getId()); 
    user.setRole(UserHelper.jsonArrayFlattenerInt((<any>roles) , '_id')); }
    return user;
  } 

  public async updateRole(entry : User) : Promise<void> {
    let saved : boolean = true;
    let rolesSavedPromise : Promise<boolean>[] = [];
    let roles : UserRole[] = [];

    if (entry.getRole() != null && entry.getRole().length > 0) {
      for (let i = 0; i < entry.getRole().length; i++) {
        let userRole : UserRole = new UserRole();
        userRole.setUserId(entry.getId());
        userRole.setRoleId(entry.getRole()[i]);
        roles.push(userRole); } }

    await this.repository.updateRole(roles);
  }

  public async deleteRole(id : number , user : User) : Promise<void> { return this.repository.deleteRole(id , user); } 

  public async updateAndDeleteRole(id : number , entry : User) : Promise<boolean> {
    let entryUpdated : boolean = true;
    let clt : QueryClient = await this.repository.getOrmClient();
    let ctx : UserServiceImpl = await this.transactionalService.get<UserServiceImpl>(this);
    let repos : CrudRepository<any>[] = [ctx.repository];

    try {
      await clt.beginTransaction([...repos] , ctx);
      await ctx.updateRole(entry);
      await ctx.deleteRole(id , entry);
      await clt.commit(); }
    catch (err : any) { await clt.rollback(); entryUpdated = false; }
    finally { await clt.endTransaction(); }

    return entryUpdated;
  } 

  public async checkUsername(username : string) : Promise<boolean> { return this.repository.checkUsername(username); }

  public async checkEmailAddress(emailAddress : string) : Promise<boolean> { return this.repository.checkEmailAddress(emailAddress); }

  public async checkMatricNumber(matricNumber : string) : Promise<boolean> { return this.repository.checkMatricNumber(matricNumber); }

  public async existsUserObject(id : string , entityName : string) : Promise<Attachment | null> { return this.repository.findObject(id , entityName); }

  public async remove(id : string) : Promise<User | null> { 
    let entry : User | null = await this.entryExists(id);
    let userId : string = "";
    if (entry !== null) userId = entry.getId() + "";

    let signature : Attachment | null = await this.existsUserObject(userId , 'UserSignature');
    let photo : Attachment | null = await this.existsUserObject(userId , 'UserProfilePhoto');
    let bucketName : string = 'THESIS_USER';
    signature !== null ? S3ObjectChange.objectDeleteByLocation(signature.getLocation() , bucketName) : void 0; 
    photo !== null ? S3ObjectChange.objectDeleteByLocation(photo.getLocation() , bucketName) : void 0;
    return this.repository.remove(id);
  } 

  public async deleteMany(entries : string | string[]) : Promise<User[]> {
    let clt : QueryClient = await this.repository.getOrmClient();
    let ctx : UserServiceImpl = await this.transactionalService.get<UserServiceImpl>(this);
    let repos : CrudRepository<any>[] = [ctx.repository , ctx.objectSweepService.getRepository()];
    let profilePhotos : Attachment[] = [];
    let profilePhotoObjects : ObjectSweep[] = [];
    let signatures : Attachment[] = [];
    let signatureObjects : ObjectSweep[] = [];
    let entriesDeleted : User[] | null = [];
      
    try {
      await clt.beginTransaction([...repos] , ctx);
      profilePhotos = await ctx.repository.findManyObject(entries , 'UserProfilePhoto');
      profilePhotoObjects = profilePhotos.map((entry : Attachment) : ObjectSweep => { let newEntry : ObjectSweep = new ObjectSweep(entry);
        let bucketName : string = ctx.eProps.getThesisUserBucket();
        newEntry.setBucketName(bucketName);
        return newEntry; });
      
      await ctx.objectSweepService.saveMany(profilePhotoObjects);
      signatures = await ctx.repository.findManyObject(entries , 'UserSignature');
      signatureObjects = signatures.map((entry : Attachment) : ObjectSweep => { let newEntry : ObjectSweep = new ObjectSweep(entry);
        let bucketName : string = ctx.eProps.getThesisUserBucket();
        newEntry.setBucketName(bucketName);
        return newEntry; });

      await ctx.objectSweepService.saveMany(signatureObjects);
      entriesDeleted = await ctx.repository.deleteMany(entries);
      await clt.commit(); }
    catch (err : any) { entriesDeleted = [];
      await clt.rollback(); }
    finally { await clt.endTransaction(); }

    return entriesDeleted;
  }
}