import * as dashboardSchemas from '@trg_package/dashboard-schemas/schemas';
import { createUrl, createClient } from '@trg_package/create-pg-client';

export const createDashboardClient = ({
  db_username,
  db_password,
  db_name
}: {
  db_username: string;
  db_password: string;
  db_name: string;
}) => {
  const DASHBOARD_PG_URL = createUrl({
    db_username,
    db_password,
    db_name
  });
  const { client, connection } = createClient(
    DASHBOARD_PG_URL,
    dashboardSchemas,
    {
      DB_MIGRATING: false,
      DB_SEEDING: false
    }
  );

  return { client, connection, DASHBOARD_PG_URL };
};
