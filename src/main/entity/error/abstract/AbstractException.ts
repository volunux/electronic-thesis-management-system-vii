export abstract class AbstractException extends Error {

  public statusCode: number;
  public message: string;

  constructor(message?: string, statusCode?: number) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.statusCode = statusCode ? statusCode : 0;
    this.message = message ? message : 'Error';
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getMessage(): string {
    return this.message;
  }

}