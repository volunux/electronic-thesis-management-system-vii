import { Entity } from 'typeorm';
import { VxEntityTwo } from './abstract/VxEntityTwo';

@Entity()
export class Publisher extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }

}