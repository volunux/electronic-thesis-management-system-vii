import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { PaymentMethodServiceImpl } from '../model/service/impl/PaymentMethodServiceImpl';
import { PaymentMethodService } from '../model/service/PaymentMethodService';
import { PaymentMethod } from '../entity/PaymentMethod';

export class PaymentMethodController extends BaseEntityController<PaymentMethod> {

  protected service: PaymentMethodService = new PaymentMethodServiceImpl();
  protected VxEntity: Newable<PaymentMethod> = PaymentMethod;

  constructor(config: RouteOptionsConfig) {
    super(config, PaymentMethod);
  }

  protected backToEntries(): string { return "/internal/payment-method/entries/"; }

  protected backToHome(): string { return "/internal/payment-method/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }

}