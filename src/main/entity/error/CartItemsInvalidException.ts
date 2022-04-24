import { AbstractException } from './abstract/AbstractException';

export class CartItemsInvalidException extends AbstractException {

  constructor(message?: string, statusCode?: number) {
    super();
    this.statusCode = statusCode ? statusCode : 400;
    this.message = message ? message : 'The items contained in the cart , one or more of the items is invalid.';
  }

}