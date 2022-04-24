import { Request, Response, NextFunction, RequestHandler } from 'express';
import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { VxEntity } from '../../entity/abstract/VxEntity';
import { Newable } from '../../entity/interface/Newable';
import { UserSession } from '../../entity/UserSession';

export abstract class BaseController {

  protected title: string;
  protected config: RouteOptionsConfig | null;

  constructor(config: RouteOptionsConfig | null) {
    this.config = config;
    this.title = config !== null && config.getTitle ? config.getTitle() : "";
  }

  public static setEntity(VxEntity: Newable<VxEntity>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body !== null && req.body !== undefined) {
        req.bindingModel = new VxEntity(req.body);
        if (req.user !== null && req.user !== undefined) {
          (<VxEntity>req.bindingModel).setUserId((<UserSession>req.user).getId());
        }
      }
      else { req.bindingModel = new VxEntity({}); }
      return next();
    }
  }

  public setEntityAttr(req: Request, res: Response, next: NextFunction): void {
    res.locals.title = this.title;
    res.locals.search_criteria = this.config && this.config.getRouteSearchCriteria ? (<RouteOptionsConfig>this.config).getRouteSearchCriteria() : void 0;

    return next();
  }

  private getConfig(): RouteOptionsConfig | null { return this.config; }

  protected abstract getBaseViewPath(): string;

  protected backToEntries(): string { return "/"; }

  protected backToHome(): string { return "/"; }

  protected getStaticBaseViewPath(): string { return "pages/static/"; }

}