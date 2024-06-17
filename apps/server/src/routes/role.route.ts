import { Router } from 'express';
import { createOne, readAll } from '../controller/role.controller';
import { validateSchema } from '../middlewares';
import { RoleInsertSchema } from '../models/schema';

const roleRouter = Router();

roleRouter.get('/read/all', readAll);
roleRouter.post(
  '/create/one',
  validateSchema({
    body: RoleInsertSchema.pick({
      name: true
    })
  }),
  createOne
);

export default roleRouter;
