import { Request, Response, NextFunction } from 'express';

export interface GenericControllerInterface {

  home(req: Request, res: Response, next: NextFunction): Promise<void>;
  findOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  addOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  save(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteMany(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  findAndDeleteAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}