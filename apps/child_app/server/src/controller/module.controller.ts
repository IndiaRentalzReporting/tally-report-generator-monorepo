import { NextFunction, Request, Response } from 'express';
import { ModuleInsert, ModuleSelect } from '../models/schema/modules';
import ModuleService from '../services/ModuleService';

export const createOne = async (
  req: Request<object, object, ModuleInsert>,
  res: Response<{ module: ModuleSelect }>,
  next: NextFunction
) => {
  try {
    const module = await ModuleService.createOne(req.body);
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
    const module = await ModuleService.updateOne(req.body, req.params.id);
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
    const module = await ModuleService.deleteOne(req.params.id);
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
    let modules = await ModuleService.readAll();
    modules = modules.filter((module) => !module.isPrivate);
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
    const module = await ModuleService.findOne({ id: req.params.id });
    return res.json({ module });
  } catch (e) {
    console.error("Couldn't fetch Module");
    return next(e);
  }
};
