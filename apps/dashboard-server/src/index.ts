import { UserSelect } from '@trg_package/schemas-dashboard/types';
import { TenantSelect } from '@trg_package/schemas-auth/types';
import config from './config';
import expressLoader from './loaders/express';
import { DashboardDatabase, DashboardServices } from './middlewares';

const { PORT, NODE_ENV } = config;

(async () => {
  const app = await expressLoader();
  try {
    app.listen(PORT, async () => {
      console.log(
        `${NODE_ENV?.toLocaleUpperCase()} Server Listening at PORT: ${PORT}`
      );
    });
  } catch (err) {
    console.error('Could not connect to the server');
  }
})();

declare global {
  namespace Express {
    interface Request {
      apiKeyUserId?: UserSelect['id'];
      apiKeyTenant?: TenantSelect;

      module: string;
      action: string;

      database: DashboardDatabase
      services: DashboardServices;
    }
  }
}
