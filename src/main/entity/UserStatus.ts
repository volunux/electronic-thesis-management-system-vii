import { VxEntityTwo } from './abstract/VxEntityTwo';
import { Entity } from 'typeorm';

@Entity('user_status')
export class UserStatus extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }

}