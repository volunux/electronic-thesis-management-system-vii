import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { BaseOrderController } from './abstract/BaseOrderController';
import { OrderService } from '../model/service/OrderService';
import { OrderServiceImpl } from '../model/service/impl/OrderServiceImpl';

export class OrderController extends BaseOrderController {

  protected service: OrderService = new OrderServiceImpl();

  constructor(config: RouteOptionsConfig) { super(config); }
}