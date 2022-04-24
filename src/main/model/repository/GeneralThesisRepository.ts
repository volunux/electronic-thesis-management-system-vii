import { BaseThesisRepository } from './generic/BaseThesisRepository';
import { Thesis } from '../../entity/Thesis';
import { ThesisComment } from '../../entity/ThesisComment';
import { ThesisReply } from '../../entity/ThesisReply';

export interface GeneralThesisRepository extends BaseThesisRepository {

  findRelatedEntries(id: number): Promise<Thesis[]>;
  saveComment(entry: ThesisComment, thesis?: Thesis): Promise<boolean>;
  saveReply(entry: ThesisReply, comment?: ThesisComment): Promise<boolean>;
  existsComment(id: number): Promise<boolean>;
  existsCommentEntry(id: number): Promise<boolean>;
  findDiscussion(id: number): Promise<ThesisComment[]>;
} 