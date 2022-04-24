import { getRepository, SelectQueryBuilder, UpdateResult, Like } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { OrderOrmSearch } from '../../../helper/search/OrderOrmSearch';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { OrderRepository } from '../OrderRepository';
import { Order } from '../../../entity/Order';
import { OrderItem } from '../../../entity/OrderItem';
import { User } from '../../../entity/User';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class AbstractBaseOrderRepositoryImpl extends AbstractBaseOrmRepositoryImpl<Order> implements OrderRepository {

  protected readonly search: OrderOrmSearch = OrderOrmSearch.getInstance();
  protected readonly VxEntity: Newable<Order> = Order;

  public async getOwnerOfOrder(reference: string): Promise<User | null> {
    let entry: Order | undefined = await getRepository(Order).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.user`, `usr`).where({ 'order_reference': reference })
      .select([`vx._id`, `usr._id`, `usr.email_address`, `usr.first_name`, `usr.last_name`]).limit(1).getOne();

    if (entry === undefined || (entry !== undefined && entry.getUser() === undefined)) return null;
    return entry.getUser();
  }

  public async findOne(id: string | number, userId?: number): Promise<Order | null> {
    let qb: SelectQueryBuilder<Order> = await this.findOneInternal(id, userId);
    let entry: Order | undefined = await qb.where({ '_id': id }).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  protected async findOneInternal(id: string | number, userId?: number): Promise<SelectQueryBuilder<Order>> {
    let qb: SelectQueryBuilder<Order> = getRepository(Order).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.user`, `usr`).leftJoinAndSelect(`vx.status`, `st`).leftJoinAndSelect(`vx.country`, `ct`)
      .leftJoinAndSelect(`vx.payment_method`, `pm`).leftJoinAndSelect(`vx.delivery_method`, `dm`)
      .select([`vx._id`, `vx.order_reference`, `vx.amount`, `vx.quantity`, `vx.city`, `vx.state`, `vx.contact_address`, `vx.phone_number`, `vx.zip`, `vx.created_on`, `vx.updated_on`,
        `usr._id`, `usr.first_name`, `usr.last_name`, `st.name`, `ct.name`, `pm.name`, `dm.name`]);

    return qb;
  }

  public async findOrderItems(id: number): Promise<OrderItem[]> {
    let entries: OrderItem[] = await getRepository(OrderItem).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.item`, `th`).where({ 'order_id': id }).select([`vx`, `th.title`, `th.slug`]).getMany();
    return entries;
  }

  public async findNonComplete(q: EntityQueryConfig): Promise<Order[]> {
    let qb: SelectQueryBuilder<Order> = await this.findAllInternal(q);
    return await qb.andWhere({ 'status': { 'name': Like(`%Pending%`) } }).orWhere({ 'status': { 'name': Like(`%Failed%`) } }).orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  protected async findAllInternal(q: EntityQueryConfig, userId?: number): Promise<SelectQueryBuilder<Order>> {
    let qb: SelectQueryBuilder<Order> = await getRepository(Order).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status`, `st`);
    if (q !== null && q !== undefined) {
      if (q.getParameter(`type`) === `reference`) { this.search.reference(qb, q); }
      if (q.getParameter(`type`) === `amount`) { this.search.amount(qb, q); }
      if (q.getParameter(`type`) === `quantity`) { this.search.quantity(qb, q); }
      else if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }
    qb.select([`vx._id`, `vx.order_reference`, `vx.amount`, `vx.quantity`, `vx.city`, `vx.updated_on`, `vx.created_on`, `st.name`]);

    return qb;
  }

  public async findAll(q: EntityQueryConfig): Promise<Order[]> {
    let qb: SelectQueryBuilder<Order> = await this.findAllInternal(q);
    return await qb.orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async update(id: string, entry: Order): Promise<Order | null> {
    let updatedEntry: Order | null = null;
    let result: UpdateResult = await getRepository(Order).createQueryBuilder(`vx`).update(Order).set({ 'status_id': entry.getStatusId(), 'updated_on': entry.getUpdatedOn() } as any)
      .where({ '_id': id }).returning(`_id`).execute();

    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { updatedEntry = new Order(result.raw[0]); }
    }
    return updatedEntry;
  }

  public async updateOne(id: string | number, userId?: number): Promise<Order | null> {
    let entry: Order | undefined = await getRepository(Order).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.user`, `usr`).where({ '_id': id })
      .select([`vx._id`, `vx.order_reference`, `vx.city`, `vx.state`, `vx.contact_address`, `vx.phone_number`, `vx.updated_on`, `vx.status_id`, `usr._id`, `usr.first_name`, `usr.last_name`])
      .limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  public async deleteOne(id: string | number, userId?: number): Promise<Order | null> {
    let entry: Order | undefined = await getRepository(Order).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status`, `st`)
      .where({ '_id': id }).select([`vx._id`, `vx.contact_address`, `st.name`]).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

}