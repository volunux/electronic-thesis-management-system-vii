import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { DeliveryMethodRepository } from '../../repository/DeliveryMethodRepository';
import { DeliveryMethodRepositoryImpl } from '../../repository/impl/DeliveryMethodRepositoryImpl';
import { DeliveryMethod } from '../../../entity/DeliveryMethod';

export class DeliveryMethodServiceImpl extends AbstractBaseServiceImpl<DeliveryMethod> {

  protected readonly repository : DeliveryMethodRepository = new DeliveryMethodRepositoryImpl();
}