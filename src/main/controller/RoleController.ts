import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { RoleServiceImpl } from '../model/service/impl/RoleServiceImpl';
import { RoleService } from '../model/service/RoleService';
import { Role } from '../entity/Role';

export class RoleController extends BaseEntityController<Role> {

  protected service: RoleService = new RoleServiceImpl();
  protected VxEntity: Newable<Role> = Role;

  constructor(config: RouteOptionsConfig) { super(config, Role); }

  protected backToEntries(): string { return "/internal/role/entries/"; }

  protected backToHome(): string { return "/internal/role/"; }

  protected getBaseViewPath(): string { return "pages/distinct/role/"; }

}