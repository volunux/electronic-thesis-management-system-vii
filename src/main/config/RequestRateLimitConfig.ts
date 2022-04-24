import { Express, Request, Response, NextFunction } from 'express';
import { RateLimitException } from '../entity/error/RateLimitException';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export class RequestRateLimitConfig {

  static init(app: Express): void {
    const limiter: RateLimitRequestHandler = rateLimit({
      'windowMs': 15 * 60 * 1000,
      'max': 100,
      'standardHeaders': true,
      'legacyHeaders': true,
      'handler': (req: Request, res: Response, next: NextFunction): void => { throw new RateLimitException(); }
    });

    app.use(limiter);
  }

}