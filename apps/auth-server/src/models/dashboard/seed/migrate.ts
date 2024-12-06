import { execSync } from 'child_process';
import path from 'path';
import config, { DASHBOARD_PG_URL } from '../../../config';

const { NODE_ENV } = config;
export function migrateDashboardSchema(PG_URL: string) {
  const appDir = path.resolve(__dirname, '../../../../../../');
  const envVariable = `${DASHBOARD_PG_URL}=${PG_URL}`;
  const scriptName = `db-dashboard:migrate:${NODE_ENV}`;

  try {
    execSync(
      `${envVariable} npm run ${scriptName}`,
      {
        stdio: 'inherit',
        cwd: appDir
      }
    );
    console.log('\n Migration Completed Successfully');
  } catch (error) {
    console.error('\n Migration failed:', error);
    throw error;
  }
}
