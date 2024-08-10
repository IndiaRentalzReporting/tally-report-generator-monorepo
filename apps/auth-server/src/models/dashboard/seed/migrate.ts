import { exec } from 'child_process';
import config, { DashboardPgUrlKey } from '../../../config';

export function migrateDashboardSchema(PG_URL: string) {
  const envVariable = `${DashboardPgUrlKey}=${PG_URL}`;
  const scriptName = 'db-dashboard:migrate';

  exec(
    `cross-env DB_MIGRATING=true ${envVariable} npm run ${scriptName}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
    }
  );
}
