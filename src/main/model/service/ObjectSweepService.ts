import { CrudServiceX } from './abstract/CrudServiceX';
import { ObjectSweep } from '../../entity/ObjectSweep';

export interface ObjectSweepService extends CrudServiceX<ObjectSweep> { 
  saveMany(entries : ObjectSweep[]) : Promise<boolean>; 
}