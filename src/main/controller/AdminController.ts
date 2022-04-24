import { Request, Response, NextFunction } from 'express';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { BaseController } from './abstract/BaseController';
import { entriesLinks, changeDisplayList, othersLink } from '../util/other/entries-list';
import fs from 'fs';
import path from 'path';

export class AdminController extends BaseController {

  constructor(config: RouteOptionsConfig | null) { super(config); }

  public dashboard(req: Request, res: Response, next: NextFunction): void { res.render(this.getBaseViewPath() + "dashboard"); }

  public entries(req: Request, res: Response, next: NextFunction): void {
    let entries: any[] = entriesLinks;
    res.render(this.getBaseViewPath() + "entries", { 'title': 'Entries', 'entries': entries });
  }

  public others(req: Request, res: Response, next: NextFunction): void {
    let entries: any[] = othersLink;
    res.render(this.getBaseViewPath() + "others", { 'title': 'Entries', 'entries': entries });
  }

  public updateOneDisplay(req: Request, res: Response, next: NextFunction): void {
    let entries: any[] = changeDisplayList;
    res.render(this.getBaseViewPath() + "update-display", { 'title': 'Display Picture', 'displays': entries });
  }

  public updateDisplay(req: Request, res: Response, next: NextFunction): void {

    let entries: any[] = changeDisplayList;
    if (req.validationErrors.isEmpty() === false) {
      let titlePath: string = process.cwd() + '/src/resource/images/';
      let file: Express.Multer.File | undefined = req.file;
      let ext: string = path.extname((<Express.Multer.File>file).originalname);
      let fileName: string = req.body.display_type + ext;
      let filePath: string = titlePath + fileName;
      if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
      res.render(this.getBaseViewPath() + "update-display", { 'title': 'Display Picture', 'displays': entries });
    }
    else {
      req.flash('success', 'Display Picture successfully updated.');
      res.redirect(this.backToHome());
    }
  }

  protected getBaseViewPath(): string { return "pages/distinct/admin/"; }

  protected backToHome(): string { return "/internal/admin/"; }

}