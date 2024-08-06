import express from 'express';

const app = express();

app.use((req, res) => {
  const host = req.get('host');
  const subdomain = host?.split('.')[0];

  console.log({ host, subdomain });

  if (subdomain === 'login') {
    res.send('Login page');
  } else if (subdomain === 'register') {
    res.send('Register page');
  } else if (subdomain !== 'saasapp') {
    res.send(`Company page for ${subdomain}`);
  } else {
    res.send('Main application');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://saasapp.test');
});
