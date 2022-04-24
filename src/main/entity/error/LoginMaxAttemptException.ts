import { AbstractException } from './abstract/AbstractException';

export class LoginMaxAttemptException extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 403;
    this.message = message ? message : 'Too many attempts to login, you can try again after 7 hours.';
  }

}