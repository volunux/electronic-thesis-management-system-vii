import { Entity } from 'typeorm';
import { VxEntityTwo } from './abstract/VxEntityTwo';

@Entity('thesis_status')
export class ThesisStatus extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }
}