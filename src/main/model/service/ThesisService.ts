import { EntityQueryConfig } from '../query/util/EntityQueryConfig';
import { BaseThesisService } from './abstract/BaseThesisService';
import { Thesis } from '../../entity/Thesis';

export interface ThesisService extends BaseThesisService {
  findAllSubmission(eqp : EntityQueryConfig , userId? : number) : Promise<Thesis[]>;
  updateStatus(slug : string , status : string) : Promise<boolean>;
  findOneById(id : number) : Promise<Thesis | null>;
}
