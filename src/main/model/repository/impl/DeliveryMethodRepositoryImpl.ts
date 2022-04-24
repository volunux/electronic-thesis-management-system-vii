import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { DeliveryMethodRepository } from '../DeliveryMethodRepository';
import { DeliveryMethod } from '../../../entity/DeliveryMethod';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class DeliveryMethodRepositoryImpl extends VxEntityTwoRepositoryImpl<DeliveryMethod> implements DeliveryMethodRepository {

  protected readonly search: DefaultEntitySearch<DeliveryMethod> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<DeliveryMethod> = DeliveryMethod;

}