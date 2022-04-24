import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { ThesisStatusServiceImpl } from '../model/service/impl/ThesisStatusServiceImpl';
import { ThesisStatusService } from '../model/service/ThesisStatusService';
import { ThesisStatus } from '../entity/ThesisStatus';

export class ThesisStatusController extends BaseEntityController<ThesisStatus> {

  protected service: ThesisStatusService = new ThesisStatusServiceImpl();
  protected VxEntity: Newable<ThesisStatus> = ThesisStatus;

  constructor(config: RouteOptionsConfig) { super(config, ThesisStatus); }

  protected backToEntries(): string { return "/internal/thesis-status/entries/"; }

  protected backToHome(): string { return "/internal/thesis-status/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }
}