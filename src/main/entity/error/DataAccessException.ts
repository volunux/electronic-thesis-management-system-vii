import { AbstractException } from './abstract/AbstractException';

export class DataAccessException extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 500;
    this.message = message ? message : 'Data Access Error';
  }

}