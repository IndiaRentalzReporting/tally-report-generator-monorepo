import { UserTenantSelect } from '@trg_package/schemas-auth/types';
import { UnauthenticatedError } from '@trg_package/errors';
import { NextFunction, Request, Response } from 'express';
import TenantService from '@/services/tenant.service';
import UserTenantService from '@/services/user_tenant.service';

export const handleSwitchTeam = async (
  req: Request<object, object, { tenant_id: UserTenantSelect['tenant_id'] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tenant_id } = req.body;

    if (!req.user || req.isUnauthenticated()) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }

    const { user } = req;

    const userTenant = await UserTenantService.findOne({
      user_id: user.id,
      tenant_id
    });

    if (!userTenant) {
      throw new UnauthenticatedError('Unauthorized to access this team!');
    }

    const tenant = await TenantService.findOne({
      id: tenant_id
    });

    req.user.tenant = tenant;
    req.session.passport = {
      user: {
        email: req.user.email,
        tenant_id: tenant.id
      }
    };

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.status(200).send();
  } catch (err) {
    return next(err);
  }
};
