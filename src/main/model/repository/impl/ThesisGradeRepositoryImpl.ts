import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisGradeRepository } from '../ThesisGradeRepository';
import { ThesisGrade } from '../../../entity/ThesisGrade';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ThesisGradeRepositoryImpl extends VxEntityTwoRepositoryImpl<ThesisGrade> implements ThesisGradeRepository {

  protected readonly search : DefaultEntitySearch<ThesisGrade> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity : Newable<ThesisGrade> = ThesisGrade;

}