import { UserAttachment } from './UserAttachment';
import { Entity } from 'typeorm';

@Entity('user_profile_photo')
export class UserProfilePhoto extends UserAttachment {

  constructor(data?: any) {
    super(data);
  }
}