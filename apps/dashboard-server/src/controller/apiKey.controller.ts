import { NextFunction, Request, Response } from 'express';
import {
  ApiKeyInsert,
  ApiKeySelect
} from '@trg_package/schemas-dashboard/types';
import crypto from 'crypto';

export const readAll = async (
  req: Request,
  res: Response<{ apiKeys: ApiKeySelect[] }>,
  next: NextFunction
) => {
  try {
    const apiKeys = await req.apiKeyService.findMany({});
    return res.json({ apiKeys });
  } catch (e) {
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<ApiKeySelect, 'id'>>,
  res: Response<{ apiKey: ApiKeySelect }>,
  next: NextFunction
) => {
  try {
    const apiKey = await req.apiKeyService.findOne({ id: req.params.id });
    return res.json({ apiKey });
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
    const apiKey = await req.apiKeyService.updateOne(req.params.id, req.body);
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
    const apiKey = await req.apiKeyService.deleteOne(req.params.id);
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
    const key = crypto.randomBytes(32).toString('hex');
    const data = req.body;
    const apiKey = await req.apiKeyService.createOne({
      ...data,
      key
    });
    return res.json({ apiKey });
  } catch (e) {
    return next(e);
  }
};
