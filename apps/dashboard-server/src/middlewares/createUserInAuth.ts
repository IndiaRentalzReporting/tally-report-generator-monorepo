import { NextFunction, Request, Response } from 'express';
import { authAxios } from '@/utils/authAxios';
import { UserInsert } from '@trg_package/schemas-auth/types';

export const createUserInAuth = async (
  req: Request<object, object, UserInsert>,
  res: Response,
  next: NextFunction
) => {
  const cookie = req.headers.cookie;
  try {
    await authAxios.post(
      '/api/v1/users/create',
      {
        ...req.body,
        tenant_id: req.user?.tenant_id
      },
      {
        headers: { cookie }
      }
    );
    return next();
  } catch (e) {
    return next(e);
};
}