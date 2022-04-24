import { Request, Response, NextFunction } from 'express';
import { ValidationErrors } from '../../helper/validation/ValidationErrors';

export class LoginAttemptMiddleware {

  public static execute(req: Request, res: Response, next: NextFunction): void {
    if ((<any>req.session).loginAttempt === undefined || (<any>req.session).loginAttempt === null) (<any>req.session).loginAttempt = 0;
    return next();
  }

}