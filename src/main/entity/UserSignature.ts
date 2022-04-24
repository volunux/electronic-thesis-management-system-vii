import { UserAttachment } from './UserAttachment';
import { Entity } from 'typeorm';

@Entity('user_signature')
export class UserSignature extends UserAttachment {

  constructor(data?: any) {
    super(data);
  }

}