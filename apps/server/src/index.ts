import expressLoader from './loaders/express';
import config from './config';
import databaseLoader from './loaders/database';
// import databaseLoader from './loaders/database';

const app = expressLoader();

const { PORT } = config.server;

(async () => {
  try {
    await databaseLoader();
    app.listen(PORT, () => console.log(`Server Listening at PORT: ${PORT}`));
  } catch (err) {
    console.error('Could not connect to the server');
  }
})();
