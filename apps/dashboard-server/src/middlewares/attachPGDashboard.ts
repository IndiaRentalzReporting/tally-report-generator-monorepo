import { BadRequestError, UnauthenticatedError } from '@trg_package/errors';
import { NextFunction, Response, Request } from 'express';
import { createUrl, createClient } from '@trg_package/pg-client';
import * as dashboardSchemas from '@/models/schemas';

export const attachPGDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.dashboardConnection && req.dashboardDb) return next();
  try {
    if (req.user || req.decryptedApiKey) {
      const { db_name, db_username, db_password } = req.user ? req.user.tenant : req.decryptedApiKey;

      if (!db_name || !db_username || !db_password) {
        throw new BadRequestError('Tenant database error, missing credentials');
      }

      const DASHBOARD_PG_URL = createUrl({
        db_username,
        db_password,
        db_name
      });

      const { client: dashboardDb, connection: dashboardConnection } = createClient(DASHBOARD_PG_URL, dashboardSchemas, {
        DB_MIGRATING: false,
        DB_SEEDING: false
      });

      req.dashboardDb = dashboardDb;
      req.dashboardConnection = dashboardConnection;

      next();
    } else {
      throw new UnauthenticatedError('User not found!');
    }
  } catch (e) {
    return next(e);
  }
};
