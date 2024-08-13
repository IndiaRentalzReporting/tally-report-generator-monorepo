import { NextFunction, Request, Response } from 'express';
import TenantService from '../services/TenantService';
import { TenantSelect, TenantInsert } from '../models/auth/schema';
import * as dashboardSchema from '@fullstack_package/dashboard-schemas/schemas';

export const createOne = async (
  req: Request<
    object,
    object,
    { tenantData: TenantInsert; userData: dashboardSchema.UserInsert }
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
    const tenant = await TenantService.deleteOneById(req.params.id);

    return res.json({ tenant });
  } catch (e) {
    console.error(`Couldn't delete Tenant with id ${req.params.id}!`);
    return next(e);
  }
};
