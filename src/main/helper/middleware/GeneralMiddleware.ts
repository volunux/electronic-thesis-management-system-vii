import { Request, Response, NextFunction } from 'express';

export class GeneralMiddleware {

  public static searchFilter(req: Request, res: Response, next: NextFunction): void {
    if (req.query !== undefined && req.query !== null) {
      res.locals.inputType = req.query.type !== undefined && req.query.type !== null ? req.query.type : "";
      res.locals.searchInput = req.query.search !== undefined && req.query.search !== null ? req.query.search : "";
    }
    return next();
  }

  public static pageFiltering(req: Request, res: Response, next: NextFunction): void {
    if (req.query !== undefined && req.query !== null) {
      let page: number = req.query.page !== undefined && req.query.page !== null ? +(<any>req.query).page : 0;
      res.locals.nextPageNumber = page ? page + 1 : 2;
      res.locals.prevPageNumber = page ? page - 1 : 0;
    }
    return next();
  }

  public static messageFlash(req: Request, res: Response, next: NextFunction): void {
    if (req.flash !== undefined && req.flash !== null) { res.locals.flashMessage = req.flash('success')[0]; }
    return next();
  }

  public static jsonMiddleWare(req: Request, res: Response, next: NextFunction): void {
    let header: string | undefined = req.headers['content-type'];
    if (header === 'application/json') { return next(); }
    else { res.status(415).json({ 'message': 'Forbidden. Unsupported media type' }); }
  }

  public static validationErrors(req: Request, res: Response, next: NextFunction): void {
    if (req.validationErrors !== undefined && req.validationErrors !== null) {
      req.validationErrors.clear();
      res.locals.errors = req.validationErrors.getErrors();
      res.locals.errorObjectList = req.validationErrors.getValidationErrorMessages();
    }
    return next();
  }

}