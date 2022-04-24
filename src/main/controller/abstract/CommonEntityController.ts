import { Request, Response, NextFunction } from 'express';
import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { Newable } from '../../entity/interface/Newable';
import { BaseStatusService } from '../../model/service/abstract/BaseStatusService';
import { BaseEntityController } from './BaseEntityController';

export abstract class CommonEntityController<T, K> extends BaseEntityController<T> {

  protected abstract statusService: BaseStatusService<K>;

  constructor(config: RouteOptionsConfig, VxEntity: Newable<T>) { super(config, VxEntity); }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: T | null = await this.service.updateOne(id);
    let statuses: K[] = [];

    if (entry !== null) {
      statuses = await this.statusService.selectOnlyNameAndId();
      if (statuses.length < 1) { throw new Error("An error has occured."); }
    }
    res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'statuses': statuses, 'title': this.title + ' Entry Update' });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entry: T | null = <T>req.bindingModel;
    let id: string = req.params.id;
    let statuses: K[] = [];

    if (req.validationErrors.isEmpty() === false) {
      if (await this.service.existsOne(id)) {
        statuses = await this.statusService.selectOnlyNameAndId();
        if (statuses.length < 1) { throw new Error("An error has occured."); }
      }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'statuses': statuses, 'title': this.title + ' Entry Update' });
      return;
    }

    entry = await this.service.update(id, <T>entry);

    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }
}