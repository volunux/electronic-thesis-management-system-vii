import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { FacultyServiceImpl } from '../model/service/impl/FacultyServiceImpl';
import { FacultyService } from '../model/service/FacultyService';
import { Faculty } from '../entity/Faculty';
import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';

export class FacultyController extends BaseEntityController<Faculty> {

  protected service: FacultyService = new FacultyServiceImpl();
  protected VxEntity: Newable<Faculty> = Faculty;

  constructor(config: RouteOptionsConfig) { super(config, Faculty); }

  protected backToEntries(): string { return "/internal/faculty/entries/"; }

  protected backToHome(): string { return "/internal/faculty/"; }

  protected getBaseViewPath(): string { return "pages/shared/one/"; }

}