import { exec } from 'child_process';
import { DashboardPgUrlKey } from '../../../config';

export function migrateDashboardSchema(PG_URL: string) {
  const envVariable = `${DashboardPgUrlKey}=${PG_URL}`;
  const scriptName = 'db-dashboard:migrate';

  exec(
    `cross-env DB_MIGRATING=true ${envVariable} npm run ${scriptName}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration Error: ${error.message}`);
        throw error;
      }
      if (stderr) {
        console.error(`Migration Stderr: ${stderr}`);
        throw error;
      }
      console.log(`Migration Stdout: ${stdout}`);
    }
  );
}
