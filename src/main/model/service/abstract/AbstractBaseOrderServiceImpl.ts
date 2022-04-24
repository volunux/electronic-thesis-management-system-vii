import { User } from '../../../entity/User';
import { Order } from '../../../entity/Order';
import { OrderRepository } from '../../repository/OrderRepository';
import { OrderService } from '../OrderService';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { AbstractBaseServiceImpl } from './AbstractBaseServiceImpl';

export abstract class AbstractBaseOrderServiceImpl extends AbstractBaseServiceImpl<Order> implements OrderService {

  protected abstract repository: OrderRepository;

  public async getOwnerOfOrder(reference: string): Promise<User | null> { return this.repository.getOwnerOfOrder(reference); }

  public async findNonComplete(eqp: EntityQueryConfig, userId: number): Promise<Order[]> { return this.repository.findNonComplete(eqp, userId); }

  public async findOne(id: string, userId?: number): Promise<Order | null> {
    let entry: Order | null = await this.repository.findOne(id, userId);
    if (entry === null) return null;
    entry.setOrderItems((await this.repository.findOrderItems(entry.getId())));
    return entry;
  }

}