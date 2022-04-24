import { getRepository } from 'typeorm';
import { AbstractBaseOrmThesisRepositoryImpl } from '../abstract/AbstractBaseOrmThesisRepositoryImpl';
import { ThesisQuery } from '../../query/ThesisQuery';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisRepository } from '../ThesisRepository';
import { Thesis } from '../../../entity/Thesis';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ThesisRepositoryImpl extends AbstractBaseOrmThesisRepositoryImpl implements ThesisRepository {

  protected readonly VxEntity : Newable<Thesis> = Thesis;
  protected readonly query : ThesisQuery = new ThesisQuery();
}