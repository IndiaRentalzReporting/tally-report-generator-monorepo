import { Router } from 'express';
import { createOne, getAll } from '../controller/module.controller';
import { validateSchema } from '../middlewares';
import { ModuleInsertSchema } from '../models/schema';

const moduleRouter = Router();

moduleRouter.post(
  '/create',
  validateSchema({
    body: ModuleInsertSchema.pick({
      name: true
    })
  }),
  createOne
);
moduleRouter.get('/all', getAll);

export default moduleRouter;
