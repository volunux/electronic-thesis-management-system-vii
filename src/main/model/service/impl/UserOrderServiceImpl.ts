import { AbstractBaseOrderServiceImpl } from '../abstract/AbstractBaseOrderServiceImpl';
import { OrderRepository } from '../../repository/OrderRepository';
import { UserOrderRepositoryImpl } from '../../repository/impl/UserOrderRepositoryImpl';

export class UserOrderServiceImpl extends AbstractBaseOrderServiceImpl {

  protected readonly repository : OrderRepository = new UserOrderRepositoryImpl();
}
