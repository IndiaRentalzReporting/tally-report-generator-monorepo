export async function connectAndLog(connectionCallback: () => Promise<void>) {
  try {
    connectionCallback();
  } catch (err) {
    console.error('Error connecting to the PostgreSQL Database:', err);
    throw err;
  }
}
