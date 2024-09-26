import { NextFunction, Request, Response } from 'express';
import TenantService from '../services/TenantService';
import { TenantSelect, TenantInsert } from '@trg_package/schemas-auth/types';

export const createOne = async (
  req: Request<object, object, TenantInsert>,
  res: Response<{ tenant: TenantSelect }>,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.createOne(req.body);

    return res.json({ tenant });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object, Partial<TenantSelect>>,
  res: Response<{ tenants: TenantSelect[] }>,
  next: NextFunction
) => {
  try {
    const tenants = await TenantService.findMany({
      ...req.query
    });
    return res.json({
      tenants
    });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<TenantSelect, 'id'>, object, Partial<TenantInsert>>,
  res: Response<{ tenant: TenantSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tenant = await TenantService.updateOneNew({ id }, req.body);

    return res.json({ tenant });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<TenantSelect, 'id'>>,
  res: Response<{ tenant: TenantSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tenant = await TenantService.deleteOneNew({ id });

    return res.json({ tenant });
  } catch (e) {
    return next(e);
  }
};
