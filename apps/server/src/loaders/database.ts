import postgres from 'postgres';
import config from '../config';

const { PG_URL } = config.postgres;

const client = postgres(PG_URL);

export async function connectAndLog() {
  try {
    await client`SELECT NOW() AS now`;
    console.log('Connected to the PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to the PostgreSQL database', err);
  } finally {
    await client.end();
  }
}
