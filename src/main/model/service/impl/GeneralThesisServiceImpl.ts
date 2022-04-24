import { GeneralThesisRepository } from '../../repository/GeneralThesisRepository';
import { GeneralThesisRepositoryImpl } from '../../repository/impl/GeneralThesisRepositoryImpl';
import { ThesisCommentRepository } from '../../repository/ThesisCommentRepository';
import { ThesisCommentRepositoryImpl } from '../../repository/impl/ThesisCommentRepositoryImpl';
import { ThesisReplyRepository } from '../../repository/ThesisReplyRepository';
import { ThesisReplyRepositoryImpl } from '../../repository/impl/ThesisReplyRepositoryImpl';
import { ThesisRepository } from '../../repository/ThesisRepository';
import { ThesisRepositoryImpl } from '../../repository/impl/ThesisRepositoryImpl';
import { AbstractBaseThesisServiceImpl } from '../abstract/AbstractBaseThesisServiceImpl';
import { GeneralThesisService } from '../GeneralThesisService';
import { Thesis } from '../../../entity/Thesis';
import { ThesisComment } from '../../../entity/ThesisComment';
import { ThesisReply } from '../../../entity/ThesisReply';

export class GeneralThesisServiceImpl extends AbstractBaseThesisServiceImpl implements GeneralThesisService {

  protected readonly repository : GeneralThesisRepository = new GeneralThesisRepositoryImpl();
  protected readonly thesisCommentRepository : ThesisCommentRepository = new ThesisCommentRepositoryImpl();
  protected readonly thesisRepository : ThesisRepository = new ThesisRepositoryImpl();
  protected readonly thesisReplyRepository : ThesisReplyRepository = new ThesisReplyRepositoryImpl();

  public async getEntryId(id : number) : Promise<number> { return this.repository.getEntryId(id); }

  public async findDiscussion(id : number) : Promise<ThesisComment[]> { return this.repository.findDiscussion(id); }

  public async findRelatedEntries(id : number) : Promise<Thesis[]> { return this.repository.findRelatedEntries(id); }

  public async saveComment(entry : ThesisComment) : Promise<boolean> { 
    let entryId : number = await this.repository.getEntryId(entry.getThesisId());
    if (!entryId) return false;
    return this.repository.saveComment(entry);
  }

  public async saveReply(entry : ThesisReply) : Promise<boolean> { 
    let entryExists : boolean = await this.thesisCommentRepository.existsOne(entry.getCommentId());
    if (!entryExists) return false;
    return this.repository.saveReply(entry); }

  public async existsComment(id : number) : Promise<boolean> { return this.repository.existsComment(id); }

  public async existsCommentEntry(id : number) : Promise<boolean> { return this.repository.existsCommentEntry(id); }
}
