import { NextFunction, Request, Response } from 'express';
import { BadRequestError, UnauthenticatedError } from '@trg_package/errors';

export const isRoleAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!!req.user) {
    const {
      user: { role },
      module,
      action
    } = req;

    if (!role) {
      throw new UnauthenticatedError(
        'You are not allowed to do anything, please get a role assigned to yourself'
      );
    }

    if (module && action) {
      const { permission } = role;

      const allowed = permission
        .filter(({ module }) => !!module)
        .find(
          ({ permissionAction, module: { name: moduleName } }) =>
            permissionAction.find(
              ({ action: { name: actionName } }) => actionName === action
            ) && moduleName === module
        );

      if (allowed) return next();
      throw new UnauthenticatedError(
        'You are not allowed to perform this action'
      );
    } else {
      throw new BadRequestError('Invalid url, no module or action found!');
    }
  }
  throw new UnauthenticatedError('You are not authenticated');
};
