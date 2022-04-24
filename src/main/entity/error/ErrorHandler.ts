import { Response } from 'express';
import { Logger } from 'winston';
import { AbstractException } from './abstract/AbstractException';
import SimpleLogger from '../../util/other/Logger';

export class ErrorHandler {

  private static readonly logger: Logger = SimpleLogger.getLogger();

  public static handle(err: Error): void {
    this.logger.error(err);
  }

  public static handleAndReturnResponse(err: Error, res: Response): void {
    this.handle(err);

    let viewBasePath: string = "pages/error/";
    let viewName: string = "error";
    let message: string = "Error";
    let statusCode: number = 400;
    let error: AbstractException = <AbstractException>err;
    let title: string = "Error";

    if (error instanceof AbstractException) {
      switch (err.constructor.name) {

        case 'CartItemsInvalidException':
          title = 'Invalid Transaction';
          break;

        case 'EntityNotFoundException':
          title = 'Entity Not Found';
          break;

        case 'AuthorizationException':
          title = 'Authorization';
          break;

        case 'LoginMaxAttemptException':
          title = 'Login Attempt';
          break;

        case 'TransactionException':
          title = 'Transaction Abortion';
          break;

        case 'RateLimitException':
          title = 'Too many request';
          break;
      }

      message = error.getMessage();
      statusCode = error.getStatusCode();
      res.status(statusCode);
      return res.render(viewBasePath + viewName, { 'message': message, 'title': title });
    }
    else { ErrorHandler.all(err, res); }
  }

  public static all(err: Error | any, res: Response) {
    let message: string = 'The action you are trying to perform cannot be processed.';
    let title: string = '';
    res.status(400);

    if (err.code == 'EBADCSRFTOKEN') {
      title = 'Invalid Form Submission';
      message = 'The form you are trying to submit contains invalid input.';
    }
    return res.render('pages/error/error', { 'message': message, 'title': title });
  }
}