import { Express } from 'express';
import authRouter from '../routes/auth.route';
import roleRouter from '../routes/role.route';

const routesLoader = (app: Express) => {
  app.get('/hello', (req, res) => res.send('Hello World!'));
  app.get('/', (req, res) => res.json({ 1: req.session.id }));
  app.use('/auth', authRouter);
  app.use('/role', roleRouter);
};

export default routesLoader;
