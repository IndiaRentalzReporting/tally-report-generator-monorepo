import expressLoader from './loaders/express';
import config from './config';
import { connectAndLog } from './loaders/database';

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
