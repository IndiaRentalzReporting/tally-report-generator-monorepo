import { NextFunction, Request, Response } from 'express';
import {
  ModuleInsert,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';

export const createOne = async (
  req: Request<object, object, ModuleInsert>,
  res: Response<{ module: ModuleSelect | null }>,
  next: NextFunction
) => {
  try {
    const module = await req.dashboard.services.module.createOne({
      ...req.body,
      name: req.body.name.toUpperCase()
    });
    return res.json({ module });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object,object,object, Partial<ModuleSelect>>,
  res: Response<{ modules: ModuleSelect[] }>,
  next: NextFunction
) => {
  try {
    const modules = await req.dashboard.services.module.findMany({
      ...req.query,
      isPrivate: false
    });
    return res.json({ modules });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<ModuleSelect, 'id'>, object, ModuleInsert>,
  res: Response<{ module: ModuleSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const module = await req.dashboard.services.module.updateOne({ id }, req.body);
    return res.json({ module });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<ModuleSelect, 'id'>, object, ModuleInsert>,
  res: Response<{ module: ModuleSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const module = await req.dashboard.services.module.deleteOne({ id });
    return res.json({ module });
  } catch (e) {
    return next(e);
  }
};
