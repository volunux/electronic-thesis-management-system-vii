import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { OrderStatus } from '../../entity/OrderStatus';

export interface OrderStatusRepository extends CrudRepositoryX<OrderStatus> {

  findByName(name: string): Promise<OrderStatus | null>;
} 