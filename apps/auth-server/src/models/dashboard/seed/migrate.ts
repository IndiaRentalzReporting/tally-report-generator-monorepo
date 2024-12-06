import { execSync } from 'child_process';
import { DASHBOARD_PG_URL } from '../../../config';

export function migrateDashboardSchema(PG_URL: string) {
  const envVariable = `${DASHBOARD_PG_URL}=${PG_URL}`;
  const scriptName = 'db-dashboard:migrate';

  try {
    execSync(
      `${envVariable} npm run ${scriptName}`,
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
