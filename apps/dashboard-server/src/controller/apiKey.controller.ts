import { NextFunction, Request, Response } from 'express';
import {
  ApiKeyInsert,
  ApiKeySelect
} from '@trg_package/schemas-dashboard/types';
import { UnauthenticatedError } from '@trg_package/errors';
import { encrypt } from '../utils/crypto';

export const readAll = async (
  req: Request<object, object,object, Partial<ApiKeySelect>>,
  res: Response<{ apiKeys: ApiKeySelect[] }>,
  next: NextFunction
) => {
  try {
    const apiKeys = await req.services.apiKey.findMany({
      ...req.query,
      isPrivate: false
    });
    return res.json({ apiKeys });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<ApiKeySelect, 'id'>, object, Partial<ApiKeySelect>>,
  res: Response<{ apiKey: ApiKeySelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const apiKey = await req.services.apiKey.updateOne({ id }, req.body);
    return res.json({ apiKey });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<ApiKeySelect, 'id'>>,
  res: Response<{ apiKey: ApiKeySelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const apiKey = await req.services.apiKey.deleteOne({ id });
    return res.json({ apiKey });
  } catch (e) {
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, ApiKeyInsert>,
  res: Response<{ apiKey: ApiKeySelect }>,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const { user } = req;

    if (!user) {
      throw new UnauthenticatedError('Not authenticated');
    }

    const encryptedData = encrypt({
      user: {
        id: user.id,
      },
      tenant: user.tenant
    });

    const apiKey = await req.services.apiKey.createOne({
      ...data,
      key: encryptedData
    });

    return res.json({ apiKey });
  } catch (e) {
    return next(e);
  }
};
