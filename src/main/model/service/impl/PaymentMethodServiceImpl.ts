import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { PaymentMethodRepository } from '../../repository/PaymentMethodRepository';
import { PaymentMethodRepositoryImpl } from '../../repository/impl/PaymentMethodRepositoryImpl';
import { PaymentMethod } from '../../../entity/PaymentMethod';

export class PaymentMethodServiceImpl extends AbstractBaseServiceImpl<PaymentMethod> {

  protected readonly repository : PaymentMethodRepository = new PaymentMethodRepositoryImpl();
}