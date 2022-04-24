import { getRepository, SelectQueryBuilder, Like } from 'typeorm';
import { AbstractBaseOrderRepositoryImpl } from '../abstract/AbstractBaseOrderRepositoryImpl';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { OrderRepository } from '../OrderRepository';
import { Order } from '../../../entity/Order';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class UserOrderRepositoryImpl extends AbstractBaseOrderRepositoryImpl implements OrderRepository {

  protected readonly VxEntity: Newable<Order> = Order;

  public async findOne(id: string | number, userId?: number): Promise<Order | null> {
    let qb: SelectQueryBuilder<Order> = await this.findOneInternal(id, userId);
    let entry: Order | undefined = await qb.where({ '_id': id, 'user_id': userId }).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findAll(q: EntityQueryConfig, userId?: number): Promise<Order[]> {
    let qb: SelectQueryBuilder<Order> = await this.findAllInternal(q, userId);
    return await qb.orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async findNonComplete(q: EntityQueryConfig, userId?: number): Promise<Order[]> {
    let qb: SelectQueryBuilder<Order> = await this.findAllInternal(q, userId, true);
    return await qb.orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  protected async findAllInternal(q: EntityQueryConfig, userId?: number, isNonComplete?: boolean): Promise<SelectQueryBuilder<Order>> {
    let qb: SelectQueryBuilder<Order> = await getRepository(Order).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.status`, `st`).where({ 'user_id': userId });

    if (isNonComplete) qb.andWhere({ 'status': { 'name': Like(`%Pending%`) } }).orWhere({ 'status': { 'name': Like(`%Failed%`) } });

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


}