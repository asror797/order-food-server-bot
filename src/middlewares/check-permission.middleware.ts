// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@exceptions';
import { RequestWithUser } from './../interfaces/auth.interface';

export const checkPermission = (requiredPermission: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log(req.user)
    // const user = req.user; // Assuming user information is stored in req.user
    // if (user && user.permissions && user.permissions.includes(requiredPermission)) {
    //   next(); // User has the required permission, proceed to the next middleware or route handler
    // } else {
    //   next(new HttpException(403, 'Insufficient permissions')); // User doesn't have the required permission
    // }
    next()
  };
};
