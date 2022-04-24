import { Express, Request, Response, NextFunction } from 'express';

export class CartConfig {

  static init(app: Express): void {

    app.use(function cartConfig(req: Request, res: Response, next: NextFunction): void {
      if (req.session.cart === undefined || req.session.cart === null) {
        
        /** For the first time when a user visits the site, the session object is checked to confirm whether there exists a cart property that is undefined or null
        and if this property does not exists, the property cart is defined on the req.session object and then initialize to an object of this signature
          {
            'items': [],
            'total_item': 0,
            'total_amount': 0,
            'total_quantity': 0
          }

        **/

        req.session.cart = {
          'items': [],
          'total_item': 0,
          'total_amount': 0,
          'total_quantity': 0
        } as any;
      }
      return next();
    });
  }
}