import { Express, Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../entity/error/ErrorHandler';

export class GlobalErrorHandler {

  public static init(app: Express): void {

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => { ErrorHandler.handleAndReturnResponse(err, res); });
  }

}