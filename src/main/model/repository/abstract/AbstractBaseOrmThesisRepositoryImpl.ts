import { DeleteResult, getRepository, In, SelectQueryBuilder, UpdateResult, InsertResult, DeleteQueryBuilder, EntityManager } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { ThesisEntitySearch } from '../../../helper/search/impl/ThesisEntitySearch';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { AbstractBaseThesisQuery } from '../../query/interface/AbstractBaseThesisQuery';
import { DynamicQuery } from '../../query/util/DynamicQuery';
import { ServiceHelper } from '../../util/ServiceHelper';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisRepository } from '../ThesisRepository';
import { Thesis } from '../../../entity/Thesis';
import { ThesisAttachment } from '../../../entity/ThesisAttachment';
import { ThesisCoverImage } from '../../../entity/ThesisCoverImage';
import { ThesisDocument } from '../../../entity/ThesisDocument';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export abstract class AbstractBaseOrmThesisRepositoryImpl extends AbstractBaseOrmRepositoryImpl<Thesis> implements ThesisRepository {

  protected readonly search: ThesisEntitySearch = ThesisEntitySearch.getInstance();
  protected abstract query: AbstractBaseThesisQuery<Thesis>;
  protected readonly VxEntity: Newable<Thesis> = Thesis;

  public async entryDownload(id: number, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).innerJoinAndSelect(`vx.document`, `td`).select([`vx._id`, `td.key`]).where({ '_id': id }).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async getEntryId(id: number): Promise<number> {
    let entry: Thesis | undefined = await getRepository(Thesis).findOne(id, { 'select': ['_id'] } as any);
    if (entry === undefined) return 0;
    return entry.getId();
  }

  public async findOneById(id: number): Promise<Thesis | null> {
    let qb: SelectQueryBuilder<Thesis> = await this.findOneInternal(id);
    let entry: Thesis | undefined = await qb.where({ '_id': id }).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findOne(id: string | number, userId?: number): Promise<Thesis | null> {
    let qb: SelectQueryBuilder<Thesis> = await this.findOneInternal(id, userId);
    let entry: Thesis | undefined = await qb.where({ 'slug': id }).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  protected async findOneInternal(id: string | number, userId?: number): Promise<SelectQueryBuilder<Thesis>> {
    let qb: SelectQueryBuilder<Thesis> = getRepository(Thesis).createQueryBuilder(`vx`)
      .leftJoinAndSelect(`vx.user`, `usr`).leftJoinAndSelect(`vx.faculty`, `ft`).leftJoinAndSelect(`vx.department`, `dt`).leftJoinAndSelect(`vx.grade`, `grd`).leftJoinAndSelect(`vx.publisher`, `pub`)
      .leftJoinAndSelect(`vx.status`, `st`).leftJoinAndSelect(`vx.cover_image`, `cimg`).leftJoinAndSelect(`vx.document`, `doc`)
      .select([`vx`, `usr._id`, `usr.email_address`, `usr.first_name`, `usr.last_name`, `ft.name`, `dt.name`, `grd.name`, `pub.name`, `st.name`, `cimg.location`, `doc._id`])

    return qb;
  }

  public async selectOnlyNameAndId(): Promise<Thesis[]> { return await getRepository(Thesis).createQueryBuilder(`vx`).select([`vx._id`, `vx.title`]).getMany(); }

  public async existsOne(id: string | number): Promise<boolean> {
    let entry: Thesis | undefined;
    entry = await getRepository(Thesis).createQueryBuilder(`vx`).where({ 'slug': id }).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  }

  public async findAll(q: EntityQueryConfig): Promise<Thesis[]> {
    let qb: SelectQueryBuilder<Thesis> = await this.findAllInternal(q);
    return await qb.orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async updateOne(id: string | number, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.user`, `usr`).where({ 'slug': id })
      .select([`vx._id`, `vx.title`, `vx.price`, `vx.number_of_page`, `vx.supervisor`, `vx.author_name`, `vx.slug`, `usr.first_name`, `usr.last_name`, `usr.email_address`,
        `vx.publication_year`, `vx.publisher_id`, `vx.faculty_id`, `vx.department_id`, `vx.grade_id`, `vx.status_id`]).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  public async update(id: string | number, entry: Thesis, userId?: number): Promise<Thesis | null> {
    let updatedEntry: Thesis | null = null;
    let plan: DynamicQuery = this.query.update(<string>id, entry, userId);
    let result: any = await getRepository(Thesis).query(plan.getText(), plan.getValues());
    if ((<any>result)[1] > 0) {
      let raw: any = (<any>result)[0][0];
      updatedEntry = new Thesis(raw);
    }

    return updatedEntry;
  }

  public async deleteOne(id: string | number, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status`, `st`)
      .where({ 'slug': id }).select([`vx._id`, `vx.title`, `vx.number_of_page`, `vx.author_name`, `vx.supervisor`, `vx.publication_year`, `vx.slug`, `st.name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async remove(id: string | number, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | null = null;
    let result: DeleteResult = await getRepository(Thesis).createQueryBuilder(`vx`).delete().where({ 'slug': id }).returning(`_id`).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new Thesis(result.raw[0]); }
    }
    return entry;
  }

  public async deleteMany(entries: string | string[]): Promise<Thesis[]> {
    let result: DeleteResult = await getRepository(Thesis).createQueryBuilder(`vx`).delete().whereInIds(entries).returning(`_id`).execute();
    return ServiceHelper.rowsToObjectMapper<Thesis>(<any>result.raw, Thesis);
  }

  public async deleteAll(): Promise<Thesis[]> { return await getRepository(Thesis).createQueryBuilder(`vx`).where({}).select([`vx._id`]).limit(1).getMany(); }

  public async findAndDeleteAll(): Promise<Thesis[]> {
    let result: DeleteResult = await getRepository(Thesis).createQueryBuilder(`vx`).delete().returning(`vx._id`).execute();
    return ServiceHelper.rowsToObjectMapper<Thesis>(<any>result.raw, Thesis);
  }

  public async findAllSubmission(q: EntityQueryConfig, userId?: number): Promise<Thesis[]> {
    let qb: SelectQueryBuilder<Thesis> = await this.findAllInternal(q, 0, true);
    return await qb.orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async entryExists(id: string, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).where({ 'slug': id }).select([`vx._id`, `vx.title`, `vx.slug`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateOneContent(id: string, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).where({ 'slug': id }).select([`vx._id`, `vx.title`, `vx.content`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateContent(id: string, entry: Thesis, userId?: number): Promise<Thesis | null> {
    let result: UpdateResult = await getRepository(Thesis).createQueryBuilder(`vx`).update(Thesis).set({ 'content': entry.getContent(), 'updated_on': entry.getUpdatedOn() } as any)
      .returning(`_id`).where({ 'slug': id }).execute();

    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new Thesis(result.raw[0]); }
    }

    if (entry === undefined) return null;
    return entry;
  }

  public async setThesisStatusPending(id: string): Promise<boolean> {
    let manager: EntityManager | null = await this.getTransactionManager();
    let updatedEntry: Thesis | null = null;
    let plan: DynamicQuery = this.query.setThesisStatusPending(<string>id);
    let result: any = manager !== null ? await manager!.getRepository(Thesis).query(plan.getText(), plan.getValues()) : await getRepository(Thesis).query(plan.getText(), plan.getValues());
    if ((<any>result)[1] > 0) {
      let raw: any = (<any>result)[0][0];
      updatedEntry = new Thesis(raw);
    }
    return true;
  }

  public async findManyObject(entries: string | string[], entityName: string): Promise<ThesisAttachment[]> {
    let manager: EntityManager | null = await this.getTransactionManager();
    let qb: SelectQueryBuilder<ThesisCoverImage> | SelectQueryBuilder<ThesisDocument> | SelectQueryBuilder<undefined>;

    switch (entityName) {
      case "ThesisCoverImage":
        qb = manager !== null ? manager!.getRepository(ThesisCoverImage).createQueryBuilder(`vx`) : getRepository(ThesisCoverImage).createQueryBuilder(`vx`);
        break;

      case "ThesisDocument":
        qb = manager !== null ? manager!.getRepository(ThesisDocument).createQueryBuilder(`vx`) : getRepository(ThesisDocument).createQueryBuilder(`vx`);

      default:
        break;
    }

    let result: any = await qb!.where({ 'thesis_id': In([...entries]) }).select([`vx.key AS key`]).execute();
    let selectedEntries: ThesisAttachment[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach((entry: any): number => selectedEntries.push(new ThesisAttachment(entry)));
      return selectedEntries;
    }
    else { return []; }
  }

  public async existsThesisObject(id: number, entityName: string): Promise<ThesisAttachment | null> {
    let manager: EntityManager | null = await this.getTransactionManager();
    let qb: SelectQueryBuilder<ThesisAttachment> | null = getRepository(ThesisCoverImage).createQueryBuilder(`vx`);

    switch (entityName) {
      case "ThesisCoverImage":
        qb = manager !== null ? manager!.getRepository(ThesisCoverImage).createQueryBuilder(`vx`) : getRepository(ThesisCoverImage).createQueryBuilder(`vx`);
        break;

      case "ThesisDocument":
        qb = manager !== null ? manager!.getRepository(ThesisDocument).createQueryBuilder(`vx`) : getRepository(ThesisDocument).createQueryBuilder(`vx`);
        break;

      default:
        break;
    }

    let entry: ThesisAttachment | undefined = await qb!.where({ 'thesis_id': id }).select([`vx._id`, `vx.location`, `vx.key`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateThesisObject(id: string | number, entityName: string): Promise<ThesisAttachment | null> { return null; }

  public async saveThesisObject(entry: ThesisAttachment, entityName: string): Promise<ThesisAttachment | null> {
    let manager: EntityManager | null = await this.getTransactionManager();
    let newEntry: ThesisAttachment | null = null;
    let result: InsertResult | null = null;

    switch (entityName) {
      case "ThesisCoverImage":
        result = manager !== null ? await manager!.getRepository(ThesisCoverImage).upsert(entry, { 'conflictPaths': ['thesis_id'] }) :
          await getRepository(ThesisCoverImage).upsert(entry, { 'conflictPaths': ['thesis_id'] });
        break;

      case "ThesisDocument":
        result = manager !== null ? await manager!.getRepository(ThesisDocument).upsert(entry, { 'conflictPaths': ['thesis_id'] }) :
          await getRepository(ThesisDocument).upsert(entry, { 'conflictPaths': ['thesis_id'] });
        break;

      default:
        break;
    }

    if (result !== null) { newEntry = new ThesisAttachment(result.raw[0]); }
    return newEntry;
  }

  public async deleteThesisObject(id: number, entityName: string): Promise<ThesisAttachment | null> {
    let entry: ThesisAttachment | null = null, qb: DeleteQueryBuilder<ThesisAttachment> | null;
    switch (entityName) {
      case "ThesisCoverImage":
        qb = getRepository(ThesisCoverImage).createQueryBuilder(`vx`).delete();
        break;

      case "ThesisDocument":
        qb = getRepository(ThesisDocument).createQueryBuilder(`vx`).delete();
        break;

      default:
        break;
    }

    let result: DeleteResult = await qb!.where({ 'thesis_id': id }).returning([`_id`, `location`, `key`]).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new ThesisAttachment(result.raw[0]); }
    }
    return entry;
  }

  public async deleteThesisObjectByKey(key: string, entityName: string): Promise<ThesisAttachment | null> {
    let entry: ThesisAttachment | null = null;
    let qb: DeleteQueryBuilder<ThesisAttachment> | null;

    switch (entityName) {
      case "ThesisCoverImage":
        qb = getRepository(ThesisCoverImage).createQueryBuilder(`vx`).delete();
        break;

      case "ThesisDocument":
        qb = getRepository(ThesisDocument).createQueryBuilder(`vx`).delete();
        break;

      default:
        break;
    }

    let result: DeleteResult = await qb!.where({ 'key': key }).returning([`_id`, `location`, `key`]).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new ThesisAttachment(result.raw[0]); }
    }
    return entry;
  }

  public async updateStatus(slug: string, status: string): Promise<boolean> {
    let updatedEntry: Thesis | null = null;
    let plan: DynamicQuery = this.query.updateStatus(<string>slug, status);
    let result: any = await getRepository(Thesis).query(plan.getText(), plan.getValues());
    if ((<any>result)[1] > 0) {
      let raw: any = (<any>result)[0][0];
      updatedEntry = new Thesis(raw);
    }
    if (updatedEntry === null) return false;
    return true;
  }

  protected async findAllInternal(q: EntityQueryConfig, userId?: number, isSubmission?: boolean): Promise<SelectQueryBuilder<Thesis>> {
    let qb: SelectQueryBuilder<Thesis> = await getRepository(Thesis).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status`, `st`).leftJoinAndSelect(`vx.department`, `dt`);
    if (isSubmission) qb.andWhere({ 'status': { 'name': `Pending` } });
    if (q !== null && q !== undefined) {
      if (q.getParameter(`type`) === `status`) { this.search.status(qb, q); }
      else if (q.getParameter(`type`) === `title`) { this.search.title(qb, q); }
      else if (q.getParameter(`type`) === `publication_year`) { this.search.publicationYear(qb, q); }
      else if (q.getParameter(`type`) === `department`) { this.search.department(qb, q); }
      else if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }

    qb.select([`vx._id`, `vx.title`, `vx.publication_year`, `vx.updated_on`, `vx.author_name`, `vx.slug`, `dt.name`, `st.name`]);
    return qb;
  }

}