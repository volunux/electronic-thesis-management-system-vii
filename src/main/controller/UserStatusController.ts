import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { UserStatusServiceImpl } from '../model/service/impl/UserStatusServiceImpl';
import { UserStatusService } from '../model/service/UserStatusService';
import { UserStatus } from '../entity/UserStatus';

export class UserStatusController extends BaseEntityController<UserStatus> {

  protected service: UserStatusService = new UserStatusServiceImpl();
  protected VxEntity: Newable<UserStatus> = UserStatus;

  constructor(config: RouteOptionsConfig) { super(config, UserStatus); }

  protected backToEntries(): string { return "/internal/user-status/entries/"; }

  protected backToHome(): string { return "/internal/user-status/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }

}