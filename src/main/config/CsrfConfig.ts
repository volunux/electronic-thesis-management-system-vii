import { Express, Request, Response, NextFunction } from 'express';
import Csrf from 'csurf';

export class CsrfConfig {

  public static init(app: Express): void {

    app.use(Csrf({
      'cookie': {
        'key': '_csrf',
        'path': '/',
        'httpOnly': true,
        'maxAge': 60 * 40,
        'secure': false
      }
    }));

    app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals._csrf = (<any>req).csrfToken();
      return next();
    });
  }

}