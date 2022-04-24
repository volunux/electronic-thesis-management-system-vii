import { AbstractException } from './abstract/AbstractException';

export class AuthorizationException extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 403;
    this.message = message ? message : 'Authorization Error';
  }

}