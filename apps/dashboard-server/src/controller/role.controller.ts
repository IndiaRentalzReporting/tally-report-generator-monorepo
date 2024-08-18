import { NextFunction, Request, Response } from 'express';
import { RoleInsert, RoleSelect } from '@trg_package/dashboard-schemas/types';
import RoleService from '../services/RoleService';

export const readAll = async (
  req: Request,
  res: Response<{ roles: RoleSelect[] }>,
  next: NextFunction
) => {
  try {
    const roles = await RoleService.findMany(
      {},
      {
        with: {
          permission: {
            columns: {
              id: true
            }
          }
        }
      }
    );
    return res.json({ roles });
  } catch (e) {
    console.error("Couldn't fetch all Roles");
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<RoleSelect, 'id'>>,
  res: Response<{ role: any }>,
  next: NextFunction
) => {
  try {
    const role = await RoleService.findOne({ id: req.params.id });
    //   {
    //     with: {
    //       permission: {
    //         columns: {
    //           module_id: false,
    //           updatedAt: false,
    //           role_id: false,
    //           createdAt: false,

    //           id: false
    //         },
    //         with: {
    //           permissionAction: {
    //             columns: {
    //               permission_id: false,
    //               action_id: false
    //             },
    //             with: {
    //               action: {
    //                 columns: {
    //                   name: true,
    //                   id: true
    //                 }
    //               }
    //             }
    //           },
    //           module: {
    //             columns: {
    //               name: true,
    //               id: true
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // );
    return res.json({ role });
  } catch (e) {
    console.error("Couldn't fetch a Role");
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, Pick<RoleInsert, 'name'>>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await RoleService.createOne(req.body);
    return res.json({
      role
    });
  } catch (e) {
    console.error("Couldn't create a new Role");
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<RoleSelect, 'id'>, object, Pick<RoleSelect, 'name'>>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await RoleService.updateOne(req.params.id, req.body);
    return res.json({
      role
    });
  } catch (e) {
    console.error("Couldn't update the Role");
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<RoleSelect, 'id'>>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await RoleService.deleteOne(req.params.id);
    return res.json({
      role
    });
  } catch (e) {
    console.error("Couldn't delete the Role");
    return next(e);
  }
};
