import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { Order } from '../../entity/Order';
import { OrderItem } from '../../entity/OrderItem';
import { User } from '../../entity/User';
import { EntityQueryConfig } from '../query/util/EntityQueryConfig';

export interface OrderRepository extends CrudRepositoryX<Order> {

  getOwnerOfOrder(reference: string): Promise<User | null>;
  findNonComplete(eqp: EntityQueryConfig, userId?: number): Promise<Order[]>;
  findOrderItems(id: number): Promise<OrderItem[]>;
} 