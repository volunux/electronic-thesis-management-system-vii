import { BaseThesisService } from './abstract/BaseThesisService';
import { Thesis } from '../../entity/Thesis';
import { ThesisComment } from '../../entity/ThesisComment';
import { ThesisReply } from '../../entity/ThesisReply';

export interface GeneralThesisService extends BaseThesisService {
  findRelatedEntries(id : number) : Promise<Thesis[]>;
  saveComment(entry : ThesisComment) : Promise<boolean>;
  saveReply(entry : ThesisReply) : Promise<boolean>;
  existsComment(id : number) : Promise<boolean>;
  existsCommentEntry(id : number) : Promise<boolean>;
  findDiscussion(id : number) : Promise<ThesisComment[]>;
}
