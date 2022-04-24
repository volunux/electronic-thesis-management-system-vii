import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { ThesisGradeServiceImpl } from '../model/service/impl/ThesisGradeServiceImpl';
import { ThesisGradeService } from '../model/service/ThesisGradeService';
import { ThesisGrade } from '../entity/ThesisGrade';

export class ThesisGradeController extends BaseEntityController<ThesisGrade> {

  protected service: ThesisGradeService = new ThesisGradeServiceImpl();
  protected VxEntity: Newable<ThesisGrade> = ThesisGrade;

  constructor(config: RouteOptionsConfig) { super(config, ThesisGrade); }

  protected backToEntries(): string { return "/internal/thesis-grade/entries/"; }

  protected backToHome(): string { return "/internal/thesis-grade/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }

}