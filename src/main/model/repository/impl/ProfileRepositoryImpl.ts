import { getRepository, SelectQueryBuilder, DeleteQueryBuilder, InsertResult, DeleteResult, UpdateResult } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { Newable } from '../../../entity/interface/Newable';
import { User } from '../../../entity/User';
import { UserDto } from '../../../entity/dto/UserDto';
import { UserStatus } from '../../../entity/UserStatus';
import { UserProfilePhoto } from '../../../entity/UserProfilePhoto';
import { UserSignature } from '../../../entity/UserSignature';
import { Attachment } from '../../../entity/Attachment';
import { ProfileRepository } from '../ProfileRepository';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ProfileRepositoryImpl extends AbstractBaseOrmRepositoryImpl<User> implements ProfileRepository {

  protected readonly VxEntity: Newable<User> = User;
  protected readonly search: any = null;

  public async findOne(id: string | number, userId?: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.faculty`, `ft`).leftJoinAndSelect(`vx.department`, `dt`).leftJoinAndSelect(`vx.country`, `ct`)
      .leftJoinAndSelect(`vx.level`, `ll`).leftJoinAndSelect(`vx.status`, `st`).leftJoinAndSelect(`vx.user_profile_photo`, `upp`).leftJoinAndSelect(`vx.user_signature`, `usig`)
      .where({ '_id': id })
      .select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.username`, `vx.email_address`, `vx.about`, `vx.matriculation_number`, `vx.updated_on`, `vx.created_on`,
        `ft.name`, `dt.name`, `ct.name`, `ll.name`, `st.name`, `upp.location`, `usig.location`]).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  public async existsOne(id: string | number): Promise<boolean> {
    let entry: User | undefined = await getRepository(User).findOne({ 'where': { '_id': id } } as any, { 'select': ['_id'] } as any);
    if (entry === undefined) return false;
    return true;
  }

  public async updateOne(id: string | number, userId?: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ '_id': id })
      .select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.about`, `vx.matriculation_number`, `vx.faculty_id`, `vx.department_id`, `vx.level_id`, `vx.country_id`, `vx.level_id`])
      .limit(1).getOne();
      
    if (entry === undefined) return null;
    return entry;
  }

  public async update(id: string | number, entry: User | UserDto, userId?: number): Promise<User | null> {
    let updatedEntry: User | null = null;
    let result: any = await getRepository(User).createQueryBuilder(`vx`).update().set(entry).where({ '_id': id }).returning(`_id`).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { updatedEntry = new User(result.raw[0]); }
    }
    return updatedEntry;
  }

  public async existsUserObject(id: number, entityName: string): Promise<Attachment | null> {
    let qb: SelectQueryBuilder<Attachment> | null;

    switch (entityName) {
      case "UserProfilePhoto":
        qb = getRepository(UserProfilePhoto).createQueryBuilder(`vx`);
        break;

      case "UserSignature":
        qb = getRepository(UserSignature).createQueryBuilder(`vx`);
        break;

      default:
        break;
    }

    let entry: Attachment | undefined = await qb!.where({ 'user_id': id }).select([`vx._id`, `vx.location`, `vx.key`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async saveUserObject(entry: Attachment, entityName: string): Promise<Attachment | null> {
    let newEntry: Attachment | null = null;
    let result: InsertResult | null = null;

    switch (entityName) {
      case "UserProfilePhoto":
        result = await getRepository(UserProfilePhoto).upsert(entry, { 'conflictPaths': ['user_id'] });
        break;

      case "UserSignature":
        result = await getRepository(UserSignature).upsert(entry, { 'conflictPaths': ['user_id'] });
        break;

      default:
        break;
    }

    if (result !== null) { newEntry = new Attachment(result.raw[0]); }
    return newEntry;
  }

  public async deleteUserObject(id: number, entityName: string): Promise<Attachment | null> {
    let entry: Attachment | null = null;
    let qb: DeleteQueryBuilder<Attachment> | null = await this.removeUserObject(entityName);
    let result: DeleteResult = await qb!.where({ 'user_id': id }).returning([`_id`, `location`, `key`]).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new Attachment(result.raw[0]); }
    }
    return entry;
  }

  public async deleteUserObjectByKey(key: string, entityName: string): Promise<Attachment | null> {
    let entry: Attachment | null = null;
    let qb: DeleteQueryBuilder<Attachment> | null = await this.removeUserObject(entityName);
    let result: DeleteResult = await qb!.where({ 'key': key }).returning([`_id`, `location`, `key`]).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new Attachment(result.raw[0]); }
    }
    return entry;
  }

  private async removeUserObject(entityName: string): Promise<DeleteQueryBuilder<Attachment> | null> {
    let qb: DeleteQueryBuilder<Attachment> | null = null;

    switch (entityName) {
      case "UserProfilePhoto":
        qb = getRepository(UserProfilePhoto).createQueryBuilder(`vx`).delete();
        break;

      case "UserSignature":
        qb = getRepository(UserSignature).createQueryBuilder(`vx`).delete();
        break;

      default:
        break;
    }

    return qb;
  }

  public async updateOneStatus(id: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).innerJoinAndSelect(`vx.status`, `st`).where({ '_id': id }).select([`vx._id`, `st.name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateStatus(id: number, status: string): Promise<User | null> {
    let updatedEntry: User | null = null;
    let result: UpdateResult = await getRepository(User)
      .query(`UPDATE USERS AS vx SET status_id = st._id FROM USER_STATUS AS st WHERE vx._id = $1 AND st.name = $2 RETURNING vx._id , vx.email_address , st.name AS status`, [id, status]);

    if ((<any>result)[1] > 0) {
      let raw: any = (<any>result)[0][0];
      let status: UserStatus = new UserStatus();
      updatedEntry = new User(raw);
      status.setName(raw['status']);
      updatedEntry.setStatus(status);
    }
    return updatedEntry;
  }

}