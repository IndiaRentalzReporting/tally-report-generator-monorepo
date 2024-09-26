import { NextFunction, Request, Response } from 'express';
import { authAxios } from '@/utils/authAxios';
import { UserInsert } from '@trg_package/schemas-auth/types';

export const createUserInAuth = async (
  req: Request<object, object, UserInsert>,
  res: Response,
  next: NextFunction
) => {
  try {
    await authAxios.post('/api/v1/users/create', {
      ...req.body,
      tenant_id: req.user?.tenant_id
    });
    return next();
  } catch (e) {
    return next(e);
  }
};
