import { NextFunction, Request, Response } from 'express';
import { PGColumnDataTypeValue } from '@fullstack_package/pg-orm';
import {
  ModuleInsert,
  ModuleSchema,
  ModuleSelect
} from '../models/schema/modules';
import BaseService from '../services/BaseService';
import DatabaseService from '../services/DatabaseService';
import PermissionService from '../services/PermissionService';

const ModuleService = new BaseService(ModuleSchema);

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
    await ModuleService.createOne(req.body.moduleDetails, async (module) => {
      try {
        await DatabaseService.createNewTable(
          module.name,
          req.body.columnDetails
        );
      } catch (e) {
        await ModuleService.deleteOneById(module.id);
      }

      await PermissionService.extendSuperuserModules(module.id);
      return res.json({ module });
    });
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
    const { name: oldName } = await ModuleService.findOne({
      id: req.params.id
    });
    const module = await ModuleService.updateOne(
      req.params.id,
      req.body,
      async (module) => DatabaseService.updateTable(oldName, module.name)
    );
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
    const module = await ModuleService.deleteOneById(
      req.params.id,
      async (module) => DatabaseService.dropTable(module.name)
    );
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
    const modules = await ModuleService.findAll();
    return res.json({ modules });
  } catch (e) {
    console.error("Couldn't fetch all Modules");
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<ModuleSelect, 'id'>>,
  res: Response<{ module: ModuleSelect; columns: Object }>,
  next: NextFunction
) => {
  try {
    await ModuleService.findOne(
      {
        id: req.params.id
      },
      async (module) => {
        console.log({ module });
        const columns = await DatabaseService.findColumns(module.name);
        return res.json({ module, columns });
      }
    );
  } catch (e) {
    console.error("Couldn't fetch Module");
    return next(e);
  }
};
