import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { DeliveryMethodServiceImpl } from '../model/service/impl/DeliveryMethodServiceImpl';
import { DeliveryMethodService } from '../model/service/DeliveryMethodService';
import { DeliveryMethod } from '../entity/DeliveryMethod';

export class DeliveryMethodController extends BaseEntityController<DeliveryMethod> {

  protected service: DeliveryMethodService = new DeliveryMethodServiceImpl();
  protected VxEntity: Newable<DeliveryMethod> = DeliveryMethod;

  constructor(config: RouteOptionsConfig) { super(config, DeliveryMethod); }

  protected backToEntries(): string { return "/internal/delivery-method/entries/"; }

  protected backToHome(): string { return "/internal/delivery-method/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }

}