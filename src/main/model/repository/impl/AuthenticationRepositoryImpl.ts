import { getRepository , SelectQueryBuilder , UpdateResult } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { AuthenticationRepository } from '../AuthenticationRepository';
import { AuthenticationQuery } from '../../query/AuthenticationQuery';
import { DynamicQuery } from '../../query/util/DynamicQuery';
import { User } from '../../../entity/User';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class AuthenticationRepositoryImpl extends AbstractBaseOrmRepositoryImpl<User> implements AuthenticationRepository {

  protected readonly search : DefaultEntitySearch<User> = DefaultEntitySearch.getInstance({});
  protected readonly query : AuthenticationQuery = new AuthenticationQuery();
  protected readonly VxEntity : Newable<User> = User;

  public async saveRole(entry : User) : Promise<User | null> { let plan : DynamicQuery = this.query.saveRole(<User>entry);
    return await this.queryTemplate.save(plan.getText() , plan.getValues() , User);
  } 

  public async save(entry : User) : Promise<User | null> { let newEntry : User | null = null;
    let plan : DynamicQuery = this.query.save(entry);
    let result : any = await getRepository(User).query(plan.getText() , plan.getValues());
    let raw : any = (<any>result)[0];
    newEntry = new User(raw);
    return newEntry;
  }

  public async addAccount() : Promise<User> { return new User({}); } 

  public async userExists(id : number) : Promise<boolean> { return this.existsOne(id); } 

  public async existsEmailAddress(emailAddress : string) : Promise<boolean> {
    let entry : User | undefined;
    entry = await getRepository(User).createQueryBuilder(`vx`).where({'email_address' : emailAddress}).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  } 

  public async existsUsername(username : string) : Promise<boolean> {
    let entry : User | undefined;
    entry = await getRepository(User).createQueryBuilder(`vx`).where({'username' : username}).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  } 

  public async existsLoginDetails(emailAddress : string) : Promise<User | null> {
    let entry : User | undefined = await getRepository(User).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status` , `st`).where({'email_address' : emailAddress})
    .select([`vx._id` , `vx.email_address` , `vx.username` , `vx.salt` , `vx.hash` , `vx.department_id` , `vx.faculty_id` , `st.name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async existsLoginDetailsById(id : number) : Promise<User | null> {
    let entry : User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({'_id' : id}).select([`vx._id` , `vx.email_address` , `vx.username` , `vx.salt` , `vx.hash`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findUserStatus(id : number) : Promise<string | null> {
    let entry : User | undefined = await getRepository(User).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status` , `st`).where({'_id' : id}).select([`vx._id` , `st.name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry.getStatus().getName();
  } 

  public async saveNewPassword(entry : User) : Promise<User | null> { let updatedEntry : User | null = null;
    let result : UpdateResult = await getRepository(User).createQueryBuilder(`vx`).update(User).set({'reset_password_token' : null , 'reset_password_expires' : null , 
      'hash' : entry.getHash() , 'salt' : entry.getSalt() , 'updated_on' : `NOW()`} as any)
    .where({'email_address' : entry.getEmailAddress()}).returning([`_id` , `email_address` , `first_name` , `last_name`]).execute();

    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { updatedEntry = new User(result.raw[0]); }  }
    return updatedEntry;
  }

  public async createForgotPasswordToken(emailAddress : string , token : string , tokenExpiryDate : string) : Promise<User | null> { let updatedEntry : User | null = null;
    let result : UpdateResult = await getRepository(User).createQueryBuilder(`vx`).update(User).set({'reset_password_token' : token , 'reset_password_expires' : tokenExpiryDate } as any)
    .where({'email_address' : emailAddress}).returning([`_id` , `email_address` , `username`]).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { updatedEntry = new User(result.raw[0]); }  }
    return updatedEntry;
  }

  public async validateResetPasswordToken(token : string) : Promise<User | null> {
    let expiryDate : string = Date.now().toString();
    let entry : User | undefined = await getRepository(User).createQueryBuilder(`vx`)
    .where(`reset_password_token = :token AND reset_password_expires > :expiryDate` , {'token' : token , 'expiryDate' : expiryDate}).select([`vx._id` , `vx.email_address`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findOne(id : string | number , userId? : number) : Promise<User | null> {
    let entry : User | undefined = await getRepository(User).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.user` , `usr`).where({'_id' : id})
    .select([`vx` , `usr._id` , `usr.first_name` , `usr.last_name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }



}