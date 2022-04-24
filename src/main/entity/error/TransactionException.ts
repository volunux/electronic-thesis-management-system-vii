import { AbstractException } from './abstract/AbstractException';

export class TransactionException extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 400;
    this.message = 'The transaction you are trying to perform has been aborted due to an error.';
  }

}