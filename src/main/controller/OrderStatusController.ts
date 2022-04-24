import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { OrderStatusServiceImpl } from '../model/service/impl/OrderStatusServiceImpl';
import { OrderStatusService } from '../model/service/OrderStatusService';
import { OrderStatus } from '../entity/OrderStatus';

export class OrderStatusController extends BaseEntityController<OrderStatus> {

  protected service: OrderStatusService = new OrderStatusServiceImpl();
  protected VxEntity: Newable<OrderStatus> = OrderStatus;

  constructor(config: RouteOptionsConfig) { super(config, OrderStatus); }

  protected backToEntries(): string { return "/internal/order-status/entries/"; }

  protected backToHome(): string { return "/internal/order-status/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }

}