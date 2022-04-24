import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { ThesisGradeRepository } from '../../repository/ThesisGradeRepository';
import { ThesisGradeRepositoryImpl } from '../../repository/impl/ThesisGradeRepositoryImpl';
import { ThesisGrade } from '../../../entity/ThesisGrade';

export class ThesisGradeServiceImpl extends AbstractBaseServiceImpl<ThesisGrade> {

  protected readonly repository : ThesisGradeRepository = new ThesisGradeRepositoryImpl();
}