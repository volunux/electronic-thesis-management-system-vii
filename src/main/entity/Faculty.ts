import { Entity } from 'typeorm';
import { VxEntityOne } from './abstract/VxEntityOne';

@Entity()
export class Faculty extends VxEntityOne {

  constructor(data?: any) {
    super(data);
  }
}