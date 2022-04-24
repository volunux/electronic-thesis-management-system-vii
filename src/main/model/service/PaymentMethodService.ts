import { CrudServiceX } from './abstract/CrudServiceX';
import { PaymentMethod } from '../../entity/PaymentMethod';

export interface PaymentMethodService extends CrudServiceX<PaymentMethod> { }