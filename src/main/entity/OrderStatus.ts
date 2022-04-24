import { VxEntityTwo } from './abstract/VxEntityTwo';
import { Entity } from 'typeorm';

@Entity('order_status')
export class OrderStatus extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }

  public getCurrentInstance(): OrderStatus {
    return this;
  }
}