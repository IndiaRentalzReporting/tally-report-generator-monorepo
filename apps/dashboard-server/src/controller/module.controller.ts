import { NextFunction, Request, Response } from 'express';
import { PGColumnDataTypeValue } from '@trg_package/pg-orm';
import {
  ModuleInsert,
  ModuleSelect
} from '@trg_package/dashboard-schemas/types';

export const createOne = async (
  req: Request<
    object,
    object,
    {
      moduleDetails: ModuleInsert;
      columnDetails: Array<{
        name: ModuleInsert['name'];
        type: PGColumnDataTypeValue;
      }>;
    }
  >,
  res: Response<{ module: ModuleSelect | null }>,
  next: NextFunction
) => {
  try {
    const module = await req.moduleService.createOne(req.body.moduleDetails);
    await req.permissionService.extendSuperuserModules(module.id);
    return res.json({ module });
  } catch (e) {
    console.error('Could not create a new Module');
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
    console.error('Could not update a Module');
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
    console.error('Could not delete a Module');
    return next(e);
  }
};

export const readAll = async (
  req: Request,
  res: Response<{ modules: ModuleSelect[] }>,
  next: NextFunction
) => {
  try {
    const modules = await req.moduleService.findMany({});
    return res.json({ modules });
  } catch (e) {
    console.error("Couldn't fetch all Modules");
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
    console.error("Couldn't fetch Module");
    return next(e);
  }
};
