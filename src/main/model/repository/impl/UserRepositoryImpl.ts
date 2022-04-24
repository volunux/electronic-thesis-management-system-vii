import { getRepository, SelectQueryBuilder, createQueryBuilder, Not, In, EntityManager } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { UserSearch } from '../../../helper/search/UserSearch';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { UserRepository } from '../UserRepository';
import { User } from '../../../entity/User';
import { DynamicQuery } from '../../query/util/DynamicQuery';
import { UserQuery } from '../../query/UserQuery';
import { UserRole } from '../../../entity/UserRole';
import { Attachment } from '../../../entity/Attachment';
import { UserProfilePhoto } from '../../../entity/UserProfilePhoto';
import { UserSignature } from '../../../entity/UserSignature';
import { VxRepository } from '../../../util/decorators/VxRepository';
import { QueryBuilderHolder } from '../../query/util/QueryBuilderHolder';

@VxRepository()
export class UserRepositoryImpl extends AbstractBaseOrmRepositoryImpl<User> implements UserRepository {

  protected readonly search: UserSearch = UserSearch.getInstance();
  protected readonly VxEntity: Newable<User> = User;
  protected readonly query: UserQuery = new UserQuery();

  public async findOne(id: string | number, userId?: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.faculty`, `ft`).leftJoinAndSelect(`vx.department`, `dt`).leftJoinAndSelect(`vx.country`, `ct`)
      .leftJoinAndSelect(`vx.level`, `ll`).leftJoinAndSelect(`vx.status`, `st`).leftJoinAndSelect(`vx.user_profile_photo`, `upp`).leftJoinAndSelect(`vx.user_signature`, `usig`)
      .where({ '_id': id }).select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.username`, `vx.email_address`, `vx.about`, `vx.matriculation_number`, `vx.updated_on`, `vx.created_on`,
        `ft.name`, `dt.name`, `ct.name`, `ll.name`, `st.name`, `upp.location`, `usig.location`]).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  public async selectOnlyNameAndId(): Promise<User[]> { return await getRepository(User).createQueryBuilder(`vx`).select([`vx._id`, `vx.username`]).getMany(); }

  public async existsOne(id: string | number): Promise<boolean> {
    let entry: User | undefined;
    entry = await getRepository(User).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`, `vx.email_address`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  }

  public async findAll(q: EntityQueryConfig): Promise<User[]> {
    let qb: SelectQueryBuilder<User> = await getRepository(User).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.faculty`, `ft`).leftJoinAndSelect(`vx.department`, `dt`)
      .leftJoinAndSelect(`vx.level`, `ll`).leftJoinAndSelect(`vx.status`, `st`);

    if (q !== null && q !== undefined) {
      if (q.getParameter(`type`) === `status`) { this.search.status(qb, q); }
      else if (q.getParameter(`type`) === `email_address`) { this.search.emailAddress(qb, q); }
      else if (q.getParameter(`type`) === `matriculation_number`) { this.search.matriculationNumber(qb, q); }
      else if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }

    return await qb.select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.email_address`, `vx.updated_on`, `ft.name`, `dt.name`, `ll.abbreviation`, `st.name`])
      .orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async updateOne(id: string | number, userId?: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ '_id': id })
      .select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.about`, `vx.matriculation_number`, `vx.faculty_id`, `vx.department_id`, `vx.level_id`, `vx.country_id`, `vx.level_id`, `vx.status_id`])
      .limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  public async update(id: string | number, entry: User, userId?: number): Promise<User | null> {
    let updatedEntry: User | null = null;
    let plan: DynamicQuery = this.query.update(+id, entry);
    let result: any = await getRepository(User).query(plan.getText(), plan.getValues());
    if ((<any>result)[1] > 0) {
      let raw: any = (<any>result)[0][0];
      updatedEntry = new User(raw);
    }
    return updatedEntry;
  }

  public async deleteOne(id: string | number, userId?: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ '_id': id })
      .select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.email_address`, `vx.matriculation_number`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findFullNameAndOthers(id: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.email_address`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateOneRole(id: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ '_id': id })
      .select([`vx._id`, `vx.first_name`, `vx.last_name`, `vx.matriculation_number`, `vx.email_address`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateRole(entries: UserRole[]): Promise<void> {
    let manager: EntityManager | null = await this.getTransactionManager();

    manager !== null ? await manager!.getRepository(UserRole).upsert(entries, { 'conflictPaths': [`user_id`, `role_id`], 'skipUpdateIfNoValuesChanged': true }) :
      await getRepository(UserRole).upsert(entries, { 'conflictPaths': [`user_id`, `role_id`], 'skipUpdateIfNoValuesChanged': true });
  }

  public async deleteRole(id: number, entry: User): Promise<void> {
    let manager: EntityManager | null = await this.getTransactionManager();

    manager !== null ? await manager!.createQueryBuilder(`user_role`, `ur`).delete().where({ 'user_id': id, 'role_id': Not(In(entry.getRole())) }).execute() :
      await createQueryBuilder(`user_role`, `ur`).delete().where({ 'user_id': id, 'role_id': Not(In(entry.getRole())) }).execute();
  }

  public async checkUsername(username: string): Promise<boolean> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ 'username': username }).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  }

  public async checkEmailAddress(emailAddress: string): Promise<boolean> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ 'email_address': emailAddress }).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  }

  public async checkMatricNumber(matricNumber: string): Promise<boolean> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ 'matriculation_number': matricNumber }).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  }

  public async entryExists(id: string, userId?: number): Promise<User | null> {
    let entry: User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findManyObject(entries: string | string[], entityName: string): Promise<Attachment[]> {
    let qb: SelectQueryBuilder<Attachment> | null = null;
    let qbHolder: QueryBuilderHolder<Attachment> = { 'qb': qb };
    await this.setRepositoryObject(entityName, qbHolder);

    return qbHolder.qb!.whereInIds({ 'user_id': entries }).select([`vx.key`]).getMany();
  }

  public async findObject(id: string, entityName: string): Promise<Attachment | null> {
    let qb: SelectQueryBuilder<Attachment> | null = null;
    let qbHolder: QueryBuilderHolder<Attachment> = { 'qb': qb };
    await this.setRepositoryObject(entityName, qbHolder);

    let entry: Attachment | undefined = await qbHolder.qb!.where({ 'user_id': id }).select([`vx.key`]).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  private async setRepositoryObject(entityName: string, qbh: QueryBuilderHolder<Attachment>): Promise<void> {
    let manager: EntityManager | null = await this.getTransactionManager();

    switch (entityName) {
      case "UserProfilePhoto":
        qbh.qb = manager !== null ? manager!.getRepository(UserProfilePhoto).createQueryBuilder(`vx`) : getRepository(UserProfilePhoto).createQueryBuilder(`vx`);
        break;

      case "UserSignature":
        qbh.qb = manager !== null ? manager!.getRepository(UserSignature).createQueryBuilder(`vx`) : getRepository(UserSignature).createQueryBuilder(`vx`);
        break;

      default:
        break;
    }
  }

  public async updateStatus(id: number, status: string): Promise<boolean> {
    let updatedEntry: User | null = null;
    let plan: DynamicQuery = this.query.updateStatus(id, status);
    let result: any = await getRepository(User).query(plan.getText(), plan.getValues());
    if ((<any>result)[1] > 0) {
      let raw: any = (<any>result)[0][0];
      updatedEntry = new User(raw);
    }
    if (updatedEntry === null) return false;
    return true;
  }

}