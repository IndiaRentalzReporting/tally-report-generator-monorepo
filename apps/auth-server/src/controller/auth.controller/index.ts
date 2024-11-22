import { NextFunction, Request, Response } from 'express';
import {
  TenantInsert,
  TenantSelect,
  UserSelect,
} from '@trg_package/schemas-auth/types';
import AuthService from '@/services/auth.service';
import { RegisterUser } from '@/types/user';

export const onboard = async (
  req: Request<object, object, { tenant: TenantInsert; user: RegisterUser }>,
  res: Response<{ tenant: TenantSelect; user: UserSelect }>,
  next: NextFunction
) => {
  try {
    const { user, tenant } = await AuthService.onboard(req.body);
    res.json({ user, tenant });
  } catch (err) {
    return next(err);
  }
};
