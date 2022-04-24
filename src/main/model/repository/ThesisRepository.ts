import { BaseThesisRepository } from './generic/BaseThesisRepository';
import { Thesis } from '../../entity/Thesis';

export interface ThesisRepository extends BaseThesisRepository {

  updateStatus(slug: string, status: string): Promise<boolean>;
} 