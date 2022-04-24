import { CrudServiceX } from './abstract/CrudServiceX';
import { ThesisComment } from '../../entity/ThesisComment';

export interface ThesisCommentService extends CrudServiceX<ThesisComment> { 
  findCommentIdsByThesisId(id : string | number) : Promise<ThesisComment[]>;
}