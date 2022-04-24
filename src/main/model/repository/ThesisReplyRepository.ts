import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { ThesisReply } from '../../entity/ThesisReply';

export interface ThesisReplyRepository extends CrudRepositoryX<ThesisReply> {

  findReplyIdsByCommentId(id : string | number) : Promise<ThesisReply[]>; 
} 