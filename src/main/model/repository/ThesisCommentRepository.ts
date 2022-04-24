import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { ThesisComment } from '../../entity/ThesisComment';

export interface ThesisCommentRepository extends CrudRepositoryX<ThesisComment> {

  findCommentIdsByThesisId(id: string | number): Promise<ThesisComment[]>;
} 