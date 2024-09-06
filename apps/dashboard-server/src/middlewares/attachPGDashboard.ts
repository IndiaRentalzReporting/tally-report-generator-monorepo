import { BadRequestError } from '@trg_package/errors';
import { NextFunction, Response, Request } from 'express';
import * as dashboardSchemas from '@trg_package/dashboard-schemas/schemas';
import { createUrl, createClient } from '@trg_package/create-pg-client';

export const attachPGDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user.tenant_id) {
    const { db_name, db_username, db_password } = req.user.tenant;

    if (!db_name || !db_username || !db_password) {
      throw new BadRequestError('Tenant database error, missing credentials');
    }

    const DASHBOARD_PG_URL = createUrl({
      db_username,
      db_password,
      db_name
    });
    const { client: dashboardDb, connection: dashboardConnection } =
      createClient(DASHBOARD_PG_URL, dashboardSchemas, {
        DB_MIGRATING: false,
        DB_SEEDING: false
      });

    req.dashboardDb = dashboardDb;
    req.dashboardConnection = dashboardConnection;
  }

  next();
};