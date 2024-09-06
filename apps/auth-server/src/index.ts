import expressLoader from './loaders/express';
import config from './config';
import { connectAndLog } from './loaders/database';
import type { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import type { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';

const { PORT, NODE_ENV } = config;

(async () => {
  const app = await expressLoader();
  try {
    app.listen(PORT, async () => {
      await connectAndLog();
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
    interface User extends AuthDetailedUser, DashDetailedUser {}
  }
}
