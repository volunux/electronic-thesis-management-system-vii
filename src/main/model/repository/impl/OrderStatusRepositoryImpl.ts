import { EntityManager, getRepository } from 'typeorm';
import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { OrderStatusRepository } from '../OrderStatusRepository';
import { OrderStatus } from '../../../entity/OrderStatus';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class OrderStatusRepositoryImpl extends VxEntityTwoRepositoryImpl<OrderStatus> implements OrderStatusRepository {

  protected readonly search: DefaultEntitySearch<OrderStatus> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<OrderStatus> = OrderStatus;

  public async findByName(name: string): Promise<OrderStatus | null> {
    let manager: EntityManager | null = await this.getTransactionManager();
    let entry: OrderStatus | undefined = manager !== null ? await manager!.getRepository(OrderStatus).createQueryBuilder(`vx`).where({ 'name': name }).select([`vx._id`]).limit(1).getOne() :
      await getRepository(OrderStatus).createQueryBuilder(`vx`).where({ 'name': name }).select([`vx._id`]).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

}