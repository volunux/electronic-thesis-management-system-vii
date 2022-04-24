import { AbstractBaseOrderRepositoryImpl } from '../abstract/AbstractBaseOrderRepositoryImpl';
import { OrderRepository } from '../OrderRepository';
import { Order } from '../../../entity/Order';
import { Newable } from '../../../entity/interface/Newable';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class OrderRepositoryImpl extends AbstractBaseOrderRepositoryImpl implements OrderRepository {

  protected readonly VxEntity: Newable<Order> = Order;
}

