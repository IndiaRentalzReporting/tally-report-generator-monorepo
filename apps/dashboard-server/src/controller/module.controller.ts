import { NextFunction, Request, Response } from 'express';
import {
  ModuleInsert,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';

export const createOne = async (
  req: Request<object, object, { moduleDetails: ModuleInsert }>,
  res: Response<{ module: ModuleSelect | null }>,
  next: NextFunction
) => {
  try {
    const module = await req.moduleService.createOne(req.body.moduleDetails);
    return res.json({ module });
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
    const module = await req.moduleService.updateOne(req.params.id, req.body);
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
    const module = await req.moduleService.deleteOne(req.params.id);
    return res.json({ module });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request,
  res: Response<{ modules: ModuleSelect[] }>,
  next: NextFunction
) => {
  try {
    const modules = await req.moduleService.findMany();
    return res.json({ modules });
  } catch (e) {
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<ModuleSelect, 'id'>>,
  res: Response<{ module: ModuleSelect }>,
  next: NextFunction
) => {
  try {
    const module = await req.moduleService.findOne({
      id: req.params.id
    });
    return res.json({ module });
  } catch (e) {
    return next(e);
  }
};
