import { VxEntityTwo } from './abstract/VxEntityTwo';
import { Entity } from 'typeorm';

@Entity('delivery_method')
export class DeliveryMethod extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }
}