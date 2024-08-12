import config from './config';
import { expressLoader } from '@fullstack_package/core-application/loaders';
import routesLoader from './loaders/routes';
import { connectionCallback } from './loaders/database';
import {
  verifyCallback,
  serializeUserCallback,
  deserializeUserCallback
} from './loaders/passport';

const { NODE_ENV, PORT, FRONTEND_URL, MONGO_URI, SESSION_SECRET } = config;

const startServer = async () => {
  const app = await expressLoader(
    {
      FRONTEND_URL,
      MONGO_URI,
      NODE_ENV,
      SESSION_SECRET
    },
    {
      verifyCallback,
      serializeUserCallback,
      deserializeUserCallback,
      connectionCallback
    }
  );
  routesLoader(app);
  try {
    app.listen(PORT, () =>
      console.log(
        `${NODE_ENV?.toLocaleUpperCase()} Server Listening at PORT: ${PORT}`
      )
    );
  } catch (err) {
    console.error('Could not connect to the server');
  }
};

startServer();
