import { NextFunction, Request, Response } from 'express';
import {
  ApiKeyInsert,
  ApiKeySelect
} from '@trg_package/schemas-dashboard/types';
import { encrypt } from '../utils/crypto';

export const readAll = async (
  req: Request<object, object,object, Partial<ApiKeySelect>>,
  res: Response<{ apiKeys: ApiKeySelect[] }>,
  next: NextFunction
) => {
  try {
    const apiKeys = await req.apiKeyService.findMany({
      ...req.query,
      isPrivate: false
    });
    return res.json({ apiKeys });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<ApiKeySelect, 'id'>, object, Pick<ApiKeyInsert, 'name'>>,
  res: Response<{ apiKey: ApiKeySelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const apiKey = await req.apiKeyService.updateOne({ id }, req.body);
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
    const apiKey = await req.apiKeyService.deleteOne({ id });
    return res.json({ apiKey });
  } catch (e) {
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, Pick<ApiKeyInsert, 'name'>>,
  res: Response<{ apiKey: ApiKeySelect }>,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const { tenant } = req.user!;
    const encryptedData = encrypt(JSON.stringify({ tenant }));

    const apiKey = await req.apiKeyService.createOne({
      ...data,
      key: encryptedData
    });
    return res.json({ apiKey });
  } catch (e) {
    return next(e);
  }
};
