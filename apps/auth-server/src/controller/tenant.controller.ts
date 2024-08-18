import { NextFunction, Request, Response } from 'express';
import TenantService from '../services/TenantService';
import { TenantSelect, TenantInsert } from '@trg_package/auth-schemas/types';
import * as dashboardSchema from '@trg_package/dashboard-schemas/schemas';
import { UserInsert } from '@trg_package/dashboard-schemas/types';

export const createOne = async (
  req: Request<
    object,
    object,
    { tenantData: TenantInsert; userData: UserInsert }
  >,
  res: Response<{ tenant: TenantSelect }>,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.onboard(
      req.body.tenantData,
      req.body.userData
    );

    return res.json({ tenant });
  } catch (e) {
    console.error("Couldn't create a Tenant");
    return next(e);
  }
};

export const readAll = async (
  req: Request,
  res: Response<{ tenants: TenantSelect[] }>,
  next: NextFunction
) => {
  try {
    const tenants = await TenantService.findMany();
    return res.json({
      tenants
    });
  } catch (e) {
    console.error("Couldn't fetch all Tenants!");
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<TenantSelect, 'id'>>,
  res: Response<{ tenant: TenantSelect }>,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.findOne({
      id: req.params.id
    });

    return res.json({
      tenant
    });
  } catch (e) {
    console.error(`Couldn't fetch Tenant with id ${req.params.id}!`);
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<TenantSelect, 'id'>, object, Partial<TenantInsert>>,
  res: Response<{ tenant: TenantSelect }>,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.updateOne(req.params.id, req.body);

    return res.json({ tenant });
  } catch (e) {
    console.error(`Couldn't update Tenant with id ${req.params.id}!`);
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<TenantSelect, 'id'>>,
  res: Response<{ tenant: TenantSelect }>,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.deleteOne(req.params.id);

    return res.json({ tenant });
  } catch (e) {
    console.error(`Couldn't delete Tenant with id ${req.params.id}!`);
    return next(e);
  }
};
