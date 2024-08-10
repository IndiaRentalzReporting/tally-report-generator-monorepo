import { ExecException, exec } from 'child_process';
import { DashboardPgUrlKey } from '../../../config';

export function migrateDashboardSchema(
  PG_URL: string,
  callback?: (
    error: ExecException | null,
    stdout: string,
    stderr: string
  ) => void
) {
  const envVariable = `${DashboardPgUrlKey}=${PG_URL}`;
  const scriptName = 'db-dashboard:migrate';

  exec(
    `cross-env DB_MIGRATING=true ${envVariable} npm run ${scriptName}`,
    callback
  );
}
