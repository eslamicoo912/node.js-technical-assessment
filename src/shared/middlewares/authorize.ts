import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export const accessControl = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // ensure the user exists
    if (!req.user) {
      next(new AppError('Authentication required to verify permissions.', 401));
      return;
    }

    // check if the user's role is included in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError('You do not have permission to perform this action.', 403));
      return;
    }

    next();
  };
};