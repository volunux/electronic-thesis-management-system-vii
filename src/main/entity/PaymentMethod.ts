import { VxEntityTwo } from './abstract/VxEntityTwo';
import { Entity } from 'typeorm';

@Entity('payment_method')
export class PaymentMethod extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }

}