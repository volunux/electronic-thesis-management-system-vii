import { Request , Response , NextFunction } from 'express';

export class LayoutConfigurer {

  private static layoutList : Set<string> = new Set<string>();

  static {
    this.layoutList.add('main');
    this.layoutList.add('rich');
    this.layoutList.add('internal');
    this.layoutList.add('profile');
    this.layoutList.add('internal-one');
    this.layoutList.add('internal-two');
    this.layoutList.add('internal-three');
    this.layoutList.add('user');
    this.layoutList.add('user-thesis');
    this.layoutList.add('upload');
    this.layoutList.add('thesis');
    this.layoutList.add('cart');
    this.layoutList.add('order');
    this.layoutList.add('thesis-delete-request');
    this.layoutList.add('log');
    this.layoutList.add('download');
  }

  public static setLayout(name : string) : any { let layoutName : string | undefined;
    for (let val of this.layoutList.keys()) {
      if (val === name) { layoutName = val;
        break; } }

    return function(req : Request , res : Response , next : NextFunction) : void { let users : Set<String> = new Set();
      req.app.locals.layout = layoutName;
      return next();
    }

  } 

}