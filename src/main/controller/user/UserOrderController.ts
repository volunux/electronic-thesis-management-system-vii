import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { BaseOrderController } from '../abstract/BaseOrderController';
import { OrderService } from '../../model/service/OrderService';
import { UserOrderServiceImpl } from '../../model/service/impl/UserOrderServiceImpl';

export class UserOrderController extends BaseOrderController {

  protected service: OrderService = new UserOrderServiceImpl();

  constructor(config: RouteOptionsConfig) { super(config); }

  protected backToEntries(): string { return "/order/user/entries/"; }

  protected backToHome(): string { return "/order/user/"; }

  protected getBaseViewPath(): string { return "pages/distinct/user-order/"; }

}