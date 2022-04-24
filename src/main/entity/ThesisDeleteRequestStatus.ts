import { VxEntityTwo } from './abstract/VxEntityTwo';
import { Entity } from 'typeorm';

@Entity('thesis_delete_request_status')
export class ThesisDeleteRequestStatus extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }
}