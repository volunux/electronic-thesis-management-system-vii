import { Entity } from 'typeorm';
import { VxEntityTwo } from './abstract/VxEntityTwo';

@Entity('thesis_grade')
export class ThesisGrade extends VxEntityTwo {

  constructor(data?: any) {
    super(data);
  }
}