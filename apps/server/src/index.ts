import expressLoader from './loaders/express';
import config from './config';
import { connectAndLog } from './loaders/database';

const app = expressLoader();

const { PORT } = config.server;

(async () => {
  try {
    // await databaseLoader();
    await connectAndLog();
    app.listen(PORT, () => console.log(`Server Listening at PORT: ${PORT}`));
  } catch (err) {
    console.error('Could not connect to the server');
  }
})();
