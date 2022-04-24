import { Request, Response, NextFunction } from 'express';
import { Express } from 'express';

export class InternalRoute {

  public static init(app: Express): void {

    app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.requestUrl = req.path;
      return next();
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
      return next();
    });
  }
}