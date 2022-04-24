import { AbstractException } from './abstract/AbstractException';

export class EntityNotFoundException extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 404;
    this.message = message ? message : 'An Error has occured. The resource you are looking for does not exists in the record or cannot be retrieved. Please check the url and try again.';
  }

}