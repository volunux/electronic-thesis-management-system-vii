import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { ThesisCommentRepository } from '../../repository/ThesisCommentRepository';
import { ThesisCommentRepositoryImpl } from '../../repository/impl/ThesisCommentRepositoryImpl';
import { ThesisComment } from '../../../entity/ThesisComment';

export class ThesisCommentServiceImpl extends AbstractBaseServiceImpl<ThesisComment> {

  protected readonly repository : ThesisCommentRepository = new ThesisCommentRepositoryImpl();

  public async findCommentIdsByThesisId(id : string | number) : Promise<ThesisComment[]> { return this.repository.findCommentIdsByThesisId(id); }
}