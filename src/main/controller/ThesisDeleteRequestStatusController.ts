import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { ThesisDeleteRequestStatusServiceImpl } from '../model/service/impl/ThesisDeleteRequestStatusServiceImpl';
import { ThesisDeleteRequestStatusService } from '../model/service/ThesisDeleteRequestStatusService';
import { ThesisDeleteRequestStatus } from '../entity/ThesisDeleteRequestStatus';

export class ThesisDeleteRequestStatusController extends BaseEntityController<ThesisDeleteRequestStatus> {

  protected service: ThesisDeleteRequestStatusService = new ThesisDeleteRequestStatusServiceImpl();
  protected VxEntity: Newable<ThesisDeleteRequestStatus> = ThesisDeleteRequestStatus;

  constructor(config: RouteOptionsConfig) { super(config, ThesisDeleteRequestStatus); }

  protected backToEntries(): string { return "/internal/thesis-delete-request-status/entries/"; }

  protected backToHome(): string { return "/internal/thesis-delete-request-status/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }

}