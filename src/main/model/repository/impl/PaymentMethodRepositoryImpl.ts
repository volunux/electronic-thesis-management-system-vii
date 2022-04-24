import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { PaymentMethodRepository } from '../PaymentMethodRepository';
import { PaymentMethod } from '../../../entity/PaymentMethod';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class PaymentMethodRepositoryImpl extends VxEntityTwoRepositoryImpl<PaymentMethod> implements PaymentMethodRepository {

  protected readonly search: DefaultEntitySearch<PaymentMethod> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<PaymentMethod> = PaymentMethod;
}