import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { ThesisReplyRepository } from '../../repository/ThesisReplyRepository';
import { ThesisReplyRepositoryImpl } from '../../repository/impl/ThesisReplyRepositoryImpl';
import { ThesisReply } from '../../../entity/ThesisReply';

export class ThesisReplyServiceImpl extends AbstractBaseServiceImpl<ThesisReply> {

  protected readonly repository : ThesisReplyRepository = new ThesisReplyRepositoryImpl();
}