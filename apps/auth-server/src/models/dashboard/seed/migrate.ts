import { execSync } from 'child_process';
import { DashboardPgUrlKey } from '../../../config';

export function migrateDashboardSchema(PG_URL: string) {
  const envVariable = `${DashboardPgUrlKey}=${PG_URL}`;
  const scriptName = 'db-dashboard:migrate';

  try {
    execSync(
      `cross-env DB_MIGRATING=true ${envVariable} npm run ${scriptName}`,
      {
        stdio: 'inherit'
      }
    );
    console.log('\n Migration Completed Successfully');
  } catch (error) {
    console.error('\n Migration failed:', error);
    throw error;
  }
}
