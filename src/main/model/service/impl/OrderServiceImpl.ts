import { AbstractBaseOrderServiceImpl } from '../abstract/AbstractBaseOrderServiceImpl';
import { OrderRepository } from '../../repository/OrderRepository';
import { OrderRepositoryImpl } from '../../repository/impl/OrderRepositoryImpl';

export class OrderServiceImpl extends AbstractBaseOrderServiceImpl {

  protected readonly repository : OrderRepository = new OrderRepositoryImpl();
}
