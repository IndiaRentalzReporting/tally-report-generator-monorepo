import * as dashboard_schema from '@trg_package/dashboard-schemas/schemas';
import { BaseServiceNew } from '@trg_package/base-service';

export const createDbClient = async ({
  db_username,
  db_password,
  db_name
}: {
  db_username: string;
  db_password: string;
  db_name: string;
}) => {
  const DASHBOARD_PG_URL = BaseServiceNew.createUrl({
    db_username,
    db_password,
    db_name
  });
  const { client, connection } = BaseServiceNew.createClient(
    DASHBOARD_PG_URL,
    dashboard_schema,
    {
      DB_MIGRATING: false,
      DB_SEEDING: false
    }
  );

  return { client, connection, DASHBOARD_PG_URL };
};
