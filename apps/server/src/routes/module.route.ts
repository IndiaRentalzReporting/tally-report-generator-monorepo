import { Router } from 'express';
import { createOne, readAll } from '../controller/module.controller';
import { validateSchema } from '../middlewares';
import { ModuleInsertSchema } from '../models/schema';

const moduleRouter = Router();

moduleRouter.post(
  '/create/one',
  validateSchema({
    body: ModuleInsertSchema.pick({
      name: true,
      isPrivate: true,
      icon: true
    })
  }),
  createOne
);
moduleRouter.get('/read/all', readAll);

export default moduleRouter;
