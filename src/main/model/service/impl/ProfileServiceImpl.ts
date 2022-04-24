import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { Attachment } from '../../../entity/Attachment';
import S3ObjectChange from '../../../helper/file/S3ObjectChange';
import { User } from '../../../entity/User';
import { Role } from '../../../entity/Role';
import { ProfileService } from '../ProfileService';
import { ProfileRepository } from '../../repository/ProfileRepository';
import { ProfileRepositoryImpl } from '../../repository/impl/ProfileRepositoryImpl';
import { RoleService } from '../RoleService';
import { RoleServiceImpl } from './RoleServiceImpl';

export class ProfileServiceImpl extends AbstractBaseServiceImpl<User> implements ProfileService {

  protected readonly repository: ProfileRepository = new ProfileRepositoryImpl();
  private readonly roleService: RoleService = new RoleServiceImpl();

  public async findOne(id: string | number): Promise<User | null> {
    let user: User | null = await this.repository.findOne(id);
    let roles: Role[] = [];
    if (user !== null) {
      roles = await this.roleService.findUserRoles(user!.getId());
      user.setRoles(roles);
    }
    return user;
  }

  public async existsUserObject(id: number, entityName: string): Promise<Attachment | null> { return this.repository.existsUserObject(id, entityName); }

  public async saveUserObject(id: number, entityName: string, entry: Attachment): Promise<Attachment | null> { return this.repository.saveUserObject(entry, entityName); }

  public async updateUserObject(id: number, entityName: string, entry: Attachment | null, bucketName: string): Promise<Attachment | null> {
    let objectLocation: string = (<Attachment>entry).getLocation();
    let existsUserObject: Attachment | null = await this.existsUserObject(id, entityName);
    entry = await this.saveUserObject(id, entityName, <Attachment>entry);
    if (entry !== null) {
      if (existsUserObject !== null) { S3ObjectChange.objectDeleteByLocation(existsUserObject.getLocation(), bucketName); }
      return entry;
    }
    else { S3ObjectChange.objectDeleteByLocation(objectLocation, bucketName); }
    return null;
  }

  public async deleteUserObject(id: number, entityName: string, bucketName: string): Promise<Attachment | null> {
    let entry: Attachment | null = await this.repository.deleteUserObject(id, entityName);
    if (entry !== null) S3ObjectChange.objectDeleteByLocation(entry.getLocation(), bucketName);
    return entry;
  }

  public async deleteUserObjectByKey(key: string, entityName: string, bucketName: string): Promise<Attachment | null> {
    let entry: Attachment | null = null;
    try {
      entry = await this.repository.deleteUserObjectByKey(key, entityName);
      await S3ObjectChange.objectDeleteByKey(key, bucketName);
    }
    catch (e: any) { entry = null; }
    return entry;
  }

  public async updateOneStatus(id: number): Promise<User | null> { return this.repository.updateOneStatus(id); }

  public async updateStatus(id: number, status: string): Promise<User | null> { return this.repository.updateStatus(id, status); }

}