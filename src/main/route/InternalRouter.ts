import express , { Request , Response , NextFunction , Router } from 'express';

export const InternalRouter : Router = express.Router();

InternalRouter.get('/' , (req : Request , res : Response , next : NextFunction) => {
  res.redirect('/internal/admin');
});