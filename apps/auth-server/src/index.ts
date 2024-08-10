import expressLoader from './loaders/express';
import config from './config';
import { connectAndLog } from './loaders/database';

const app = expressLoader();

const { NODE_ENV, PORT } = config;

(async () => {
  try {
    await connectAndLog();
    app.listen(PORT, () =>
      console.log(
        `${NODE_ENV?.toLocaleUpperCase()} Server Listening at PORT: ${PORT}`
      )
    );
  } catch (err) {
    console.error('Could not connect to the server');
  }
})();
