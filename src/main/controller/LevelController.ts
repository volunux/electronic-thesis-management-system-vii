import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { LevelServiceImpl } from '../model/service/impl/LevelServiceImpl';
import { LevelService } from '../model/service/LevelService';
import { Level } from '../entity/Level';

export class LevelController extends BaseEntityController<Level> {

  protected service: LevelService = new LevelServiceImpl();
  protected VxEntity: Newable<Level> = Level;

  constructor(config: RouteOptionsConfig) { super(config, Level); }

  protected backToEntries(): string { return "/internal/level/entries/"; }

  protected backToHome(): string { return "/internal/level/"; }

  protected getBaseViewPath(): string { return "pages/shared/one/"; }

}