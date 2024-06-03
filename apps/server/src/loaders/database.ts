import { connect } from 'mongoose';
import config from '../config';

const databaseLoader = async () => {
  const { MONGO_URI } = config.mongo;
  try {
    return await connect(MONGO_URI).then(() =>
      console.log('Successfully connected to the Database!')
    );
  } catch (err) {
    console.error('Could not connect to the Database! :(');
    throw err;
  }
};

export default databaseLoader;
