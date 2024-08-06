import express from 'express';
import vhost from 'vhost';

const app = express();
const port = 3000;

// App subdomain
const appDomain = express();
appDomain.get('/', (req, res) => {
  res.send('Hello from app.localhost!');
});

// Admin subdomain
const adminDomain = express();
adminDomain.get('/', (req, res) => {
  res.send('Hello from admin.localhost!');
});

// Use vhost to handle subdomains
app.use(vhost('app.localhost', appDomain));
app.use(vhost('admin.localhost', adminDomain));

// Main domain
app.get('/', (req, res) => {
  res.send('Hello from the main domain!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
