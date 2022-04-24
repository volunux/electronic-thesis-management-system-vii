import { AbstractException } from './abstract/AbstractException';

export class AuthenticationError extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 403;
    this.message = message ? message : 'Authentication Error';
  }

}