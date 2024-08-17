import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import {
  RoleSelect,
  UserSelect,
  DetailedUser,
  UserInsert
} from '../models/schema';
import { NotFoundError } from '@trg_package/errors';

export const readAll = async (
  req: Request,
  res: Response<{ users: Omit<DetailedUser, 'password'>[] }>,
  next: NextFunction
) => {
  try {
    const usersWithPassword = await UserService.findMany(
      { id: req.user?.id ?? '' },
      {
        with: {
          role: {
            columns: {
              name: true
            },
            with: {
              permission: {
                columns: {
                  role_id: false,
                  createdAt: false,
                  updatedAt: false,
                  module_id: false
                },
                with: {
                  permissionAction: {
                    columns: {
                      permission_id: false,
                      action_id: false
                    },
                    with: {
                      action: {
                        columns: {
                          name: true
                        }
                      }
                    }
                  },
                  module: {
                    columns: {
                      name: true,
                      id: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    );
    const users = usersWithPassword.map(
      ({ password, ...user }) => user
    ) as Omit<DetailedUser, 'password'>[];
    return res.json({
      users
    });
  } catch (e) {
    console.error("Couldn't fetch all Users!");
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: Omit<DetailedUser, 'password'> }>,
  next: NextFunction
) => {
  try {
    const u = (await UserService.findOneDetailedUser({
      id: req.params.id
    })) as DetailedUser;
    const user = UserService.prettifyUser(u);

    if (!user) throw new NotFoundError('User does not exist');

    const { password, ...userWithoutPassword } = user;
    return res.json({
      user: userWithoutPassword
    });
  } catch (e) {
    console.error("Couldn't fetch all Users!");
    return next(e);
  }
};

export const updateRole = async (
  req: Request<
    object,
    object,
    { userIds: UserSelect['id'][]; roleId: RoleSelect['id'] }
  >,
  res: Response<{ userIds: string[] }>,
  next: NextFunction
) => {
  try {
    const userIds = await UserService.updateRole(
      req.body.userIds,
      req.body.roleId
    );

    return res.json({ userIds });
  } catch (e) {
    console.error("Couldn't assign a role to users");
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<UserSelect, 'id'>, object, Partial<UserInsert>>,
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { password, ...user } = await UserService.updateOne(
      req.params.id,
      req.body
    );

    return res.json({ user });
  } catch (e) {
    console.error("Couldn't delete a user");
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { password, ...user } = await UserService.deleteOne(req.params.id);

    return res.json({ user });
  } catch (e) {
    console.error("Couldn't delete a user");
    return next(e);
  }
};
