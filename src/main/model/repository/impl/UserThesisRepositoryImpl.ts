import { getRepository, SelectQueryBuilder, In } from 'typeorm';
import { AbstractBaseOrmThesisRepositoryImpl } from '../abstract/AbstractBaseOrmThesisRepositoryImpl';
import { UserThesisQuery } from '../../query/UserThesisQuery';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { ThesisEntitySearch } from '../../../helper/search/impl/ThesisEntitySearch';
import { DynamicQuery } from '../../query/util/DynamicQuery';
import { Newable } from '../../../entity/interface/Newable';
import { UserThesisRepository } from '../UserThesisRepository';
import { Thesis } from '../../../entity/Thesis';
import { Order } from '../../../entity/Order'
import { OrderItem } from '../../../entity/OrderItem';
import { ThesisDeleteRequest } from '../../../entity/ThesisDeleteRequest';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class UserThesisRepositoryImpl extends AbstractBaseOrmThesisRepositoryImpl implements UserThesisRepository {

  protected readonly search: ThesisEntitySearch = ThesisEntitySearch.getInstance();
  protected readonly query: UserThesisQuery = new UserThesisQuery();
  protected readonly VxEntity: Newable<Thesis> = Thesis;

  public async entryDownload(id: number, userId: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).innerJoinAndSelect(`vx.document`, `td`).select([`vx._id`, `td.key`]).where({ '_id': id, 'user_id': userId }).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async entriesDownload(userId: number): Promise<OrderItem[]> {
    let result = await getRepository(Order).createQueryBuilder(`vx`).innerJoin(`vx.status`, `st`).select([`vx`, `st`]).where({ 'status': { 'name': 'Completed' }, 'user_id': userId }).getMany();
    let ids: number[] = result.map((item) => { return item.getId(); });
    let entries = await getRepository(OrderItem).createQueryBuilder(`vx`).innerJoinAndSelect(`vx.item`, `th`)
      .select([`vx._id`, `vx.order_id`, `th._id`, `th.title`, `th.publication_year`, `th.author_name`, `th.price`, `th.number_of_page`, `th.slug`]).where({ 'order_id': In(ids) }).getMany();
      
    return entries;
  }

  public async userOrderEntryDownload(userId: number, orderId: number, thesisId: number): Promise<OrderItem | null> {
    let order: Order | undefined = await getRepository(Order).createQueryBuilder(`vx`).innerJoin(`vx.status`, `st`).select([`vx._id`])
      .where({ '_id': orderId, 'user_id': userId, 'status': { 'name': 'Completed' } }).getOne();

    if (order === undefined) return null;
    let entry: OrderItem | undefined = await getRepository(OrderItem).createQueryBuilder(`vx`).innerJoin(`vx.item`, `th`).leftJoinAndSelect(`th.document`, `td`)
      .select([`vx._id`, `th._id`, `td.key`]).where({ 'order_id': orderId, 'item_id': thesisId }).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findOneDeleteRequest(id: number, userId: number): Promise<ThesisDeleteRequest | null> {
    let entry: ThesisDeleteRequest | undefined = await getRepository(ThesisDeleteRequest).createQueryBuilder(`vx`)
      .leftJoinAndSelect(`vx.requester`, `rq`).leftJoinAndSelect(`vx.handler`, `hd`).leftJoinAndSelect(`vx.thesis`, `th`).leftJoinAndSelect(`vx.status`, `st`)
      .where({ '_id': id, 'requester_id': userId })
      .select([`vx._id`, `vx.message`, `vx.response`, `vx.created_on`, `vx.updated_on`, `th._id`, `th.title`, `hd.first_name`, `hd.last_name`, `rq.first_name`, `rq.last_name`, `st.name`]).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  public async findAllDeleteRequest(q: EntityQueryConfig, userId?: number): Promise<ThesisDeleteRequest[]> {
    let qb: SelectQueryBuilder<ThesisDeleteRequest> = await getRepository(ThesisDeleteRequest).createQueryBuilder(`vx`)
      .leftJoinAndSelect(`vx.requester`, `rq`).leftJoinAndSelect(`vx.thesis`, `th`).leftJoinAndSelect(`vx.status`, `st`).where({ 'requester_id': userId });

    if (q !== null && q !== undefined) {
      if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }
    return await qb.select([`vx._id`, `vx.updated_on`, `th._id`, `th.title`, `rq.first_name`, `rq.last_name`, `st.name`]).orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async findOne(id: string | number, userId?: number): Promise<Thesis | null> {
    let qb: SelectQueryBuilder<Thesis> = await this.findOneInternal(id, userId);
    let entry: Thesis | undefined = await qb.where({ 'slug': id, 'user_id': userId }).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async userOrderEntryDownloadDetail(id: string): Promise<Thesis | null> { return super.findOne(id); }

  public async saveDeleteRequest(id: number, entry: ThesisDeleteRequest): Promise<boolean> {
    let updatedEntry: ThesisDeleteRequest | null = null;
    let plan: DynamicQuery = this.query.saveDeleteRequest(id, entry);
    let result: any = await getRepository(ThesisDeleteRequest).query(plan.getText(), plan.getValues());
    let raw: any = (<any>result)[0];
    updatedEntry = new ThesisDeleteRequest(raw);
    return true;
  }

  public async findAll(q: EntityQueryConfig, userId?: number): Promise<Thesis[]> {
    let qb: SelectQueryBuilder<Thesis> = await this.findAllInternal(q, <number>userId);
    return await qb.orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async save(entry: Thesis): Promise<Thesis | null> {
    let newEntry: Thesis | null = null;
    let plan: DynamicQuery = this.query.save(entry);
    let result: any = await getRepository(Thesis).query(plan.getText(), plan.getValues());
    let raw: any = (<any>result)[0];
    newEntry = new Thesis(raw);
    return newEntry;
  }

  public async updateOne(id: string | number, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).where({ 'slug': id, 'user_id': userId })
      .select([`vx._id`, `vx.title`, `vx.price`, `vx.number_of_page`, `vx.supervisor`, `vx.author_name`, `vx.slug`,
        `vx.publication_year`, `vx.faculty_id`, `vx.department_id`, `vx.publisher_id`, `vx.grade_id`, `vx.status_id`]).limit(1).getOne();
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

  public async findAllSubmission(q: EntityQueryConfig, userId?: number): Promise<Thesis[]> {
    let qb: SelectQueryBuilder<Thesis> = await this.findAllInternal(q, <number>userId, true);
    return await qb.orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async entryExists(id: string, userId?: number): Promise<Thesis | null> {
    let entry: Thesis | undefined = await getRepository(Thesis).createQueryBuilder(`vx`).where({ 'slug': id, 'user_id': userId }).select([`vx._id`, `vx.title`, `vx.slug`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateContent(id: string, entry: Thesis, userId?: number): Promise<Thesis | null> {
    let updatedEntry: Thesis | null = null;
    let plan: DynamicQuery = this.query.updateContent(<string>id, entry, userId);
    let result: any = await getRepository(Thesis).query(plan.getText(), plan.getValues());
    if ((<any>result)[1] > 0) {
      let raw: any = (<any>result)[0][0];
      updatedEntry = new Thesis(raw);
    }
    return updatedEntry;
  }

  protected async findAllInternal(q: EntityQueryConfig, userId: number, isSubmission?: boolean): Promise<SelectQueryBuilder<Thesis>> {
    let qb: SelectQueryBuilder<Thesis> = await getRepository(Thesis).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status`, `st`).leftJoinAndSelect(`vx.department`, `dt`).where({ 'user_id': userId });

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