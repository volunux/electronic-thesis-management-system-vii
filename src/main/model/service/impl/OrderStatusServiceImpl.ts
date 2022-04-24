import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { OrderStatusRepository } from '../../repository/OrderStatusRepository';
import { OrderStatusRepositoryImpl } from '../../repository/impl/OrderStatusRepositoryImpl';
import { OrderStatus } from '../../../entity/OrderStatus';

export class OrderStatusServiceImpl extends AbstractBaseServiceImpl<OrderStatus> {

  protected readonly repository : OrderStatusRepository = new OrderStatusRepositoryImpl();
}