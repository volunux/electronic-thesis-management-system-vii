import { AbstractException } from './abstract/AbstractException';

export class RateLimitException extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 500;
    this.message = message ? message : 'Too many requests, please try again later.';
  }

}