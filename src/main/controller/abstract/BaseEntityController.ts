import { Request, Response, NextFunction } from 'express';
import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { GenericControllerInterface } from './GenericControllerInterface';
import { VxEntity } from '../../entity/abstract/VxEntity';
import { Newable } from '../../entity/interface/Newable';
import { UserSession } from '../../entity/UserSession';
import { GeneralFilter } from '../../helper/filter/GeneralFilter';
import { CrudServiceX } from '../../model/service/abstract/CrudServiceX';
import { BaseController } from './BaseController';

export abstract class BaseEntityController<T> extends BaseController implements GenericControllerInterface {

  protected abstract service: CrudServiceX<T>;
  protected abstract VxEntity: Newable<T>;

  constructor(config: RouteOptionsConfig, VxEntity: Newable<T>) { super(config); }

  public async home(req: Request, res: Response, next: NextFunction): Promise<void> { res.render(this.getBaseViewPath() + "dashboard"); }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let entry: T | null = await this.service.findOne(id, userId);
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'title': this.title + ' Entry Detail' });
  }

  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let userId: number = 0;

    if (req.user && (<UserSession>req.user).getId) userId = (<UserSession>req.user).getId();
    let lastEntry: string = new Date().toString();
    let firstEntry: string = new Date().toString();
    let lastEntryId: string = "10";
    let firstEntryId: string = "1";
    let entries: T[] = await this.service.findAll(req.queryConfig, userId);
    let totalCount: number = entries.length;

    if (entries.length > 0) {
      if (((entries[entries.length - 1] as unknown) as VxEntity).getUpdatedOn) { lastEntry = ((entries[entries.length - 1] as unknown) as VxEntity).getUpdatedOn().toString(); }
      if (((entries[entries.length - 1] as unknown) as VxEntity).getId) { lastEntryId = ((entries[entries.length - 1] as unknown) as VxEntity).getId().toString(); }
      if (((entries[0] as unknown) as VxEntity).getId) { firstEntryId = ((entries[0] as unknown) as VxEntity).getId().toString(); }
      if (((entries[0] as unknown) as VxEntity).getUpdatedOn) { firstEntry = ((entries[0] as unknown) as VxEntity).getUpdatedOn().toString(); }
    }

    res.render(this.getBaseViewPath() + "entries", {
      'entries': entries, 'firstEntry': firstEntry, 'lastEntry': lastEntry, 'firstEntryId': firstEntryId, 'lastEntryId': lastEntryId,
      'totalCount': totalCount, 'title': this.title + ' Entries'
    });
  }

  public async rselectNameAndId(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entries: T[] = await this.service.selectOnlyNameAndId();
    entries = GeneralFilter.arrayOfCusObjectFieldFilter(['name', '_id'], entries);
    res.status(200).json(entries);
  }

  public async addOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entry: T = new this.VxEntity({});
    res.render(this.getBaseViewPath() + "entry-create", { 'entry': entry, 'title': this.title + ' Entry Add' });
  }

  public async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entry: T | null = <T>req.bindingModel;
    if (req.validationErrors.isEmpty() === false) {
      res.render(this.getBaseViewPath() + "entry-create", { 'entry': entry, 'title': this.title + ' Entry Add' });
      return;
    }

    entry = await this.service.save(<T>entry);
    if (entry !== null) {
      req.flash('success', 'Entry successfully added.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to save entry."); }
  }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id = req.params.id;
    let entry: T | null = await this.service.updateOne(id);
    res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'title': this.title + ' Entry Update' });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: T | null = <T>req.bindingModel;

    if (req.validationErrors.isEmpty() === false) {
      if (await this.service.existsOne(id)) { } else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'title': this.title + ' Entry Update' });
      return;
    }

    entry = await this.service.update(id, <T>entry);

    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to update entry."); }
  }

  public async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: T | null = await this.service.deleteOne(id);
    res.render(this.getBaseViewPath() + "entry-delete", { 'entry': entry, 'toDelete': true, 'title': this.title + ' Entry Delete' });
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {

    let id: string = req.params.id;
    let entry: T | null = <T>req.bindingModel;

    if (req.validationErrors.isEmpty() === false) {
      if (await this.service.existsOne(id)) { } else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-delete", { 'entry': entry, 'toDelete': true, 'title': this.title + ' Entry Delete' });
      return;
    }

    entry = await this.service.remove(id);

    if (entry !== null) {
      req.flash('success', 'Entry successfully removed.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to delete entry."); }
  }

  public async deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    let b: any = req.body;
    let entries: string[] = b.entries !== null && b.entries.length > 0 ? b.entries : [];
    let deletedEntries: T[] = await this.service.deleteMany(entries);

    if (deletedEntries.length > 0) { res.json({ 'message': 'Entry or Entries successfully deleted.' }); }
    else { res.status(400).json({ 'message': 'Unable to delete Entry or Entries' }); }
  }

  public async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entries: T[] = await this.service.deleteAll();
    res.render('pages/shared/all/entry-delete-all', { 'entries': entries, 'title': this.title + ' Entries Delete All' });
  }

  public async findAndDeleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.flash('success', 'Entries successfully deleted.');
    let entries: T[] = await this.service.findAndDeleteAll();
    if (entries.length > 0) { res.redirect(this.backToHome()); }
    else { throw new Error("An error has occured."); }
  }
}