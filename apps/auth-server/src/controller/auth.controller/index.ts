import { NextFunction, Request, Response } from 'express';
import {
  TenantInsert,
} from '@trg_package/schemas-auth/types';
import AuthService from '../../services/auth.service';
import { RegisterUser } from '../../types/user';

export const onboard = async (
  req: Request<object, object, { tenant: TenantInsert; user: RegisterUser }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await AuthService.onboard(req.body);
    res.status(200).send();
  } catch (err) {
    return next(err);
  }
};
