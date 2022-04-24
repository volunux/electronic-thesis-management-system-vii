import { Entity } from 'typeorm';
import { VxEntityOne } from './abstract/VxEntityOne';

@Entity()
export class Country extends VxEntityOne {

  constructor(data?: any) {
    super(data);
  }

}