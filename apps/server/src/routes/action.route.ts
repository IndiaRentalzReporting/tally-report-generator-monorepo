import { Router } from 'express';
import { createOne, readAll } from '../controller/action.controller';
import { validateSchema } from '../middlewares';
import { ActionInsertSchema } from '../models/schema';

const actionRouter = Router();

actionRouter.get('/read/all', readAll);
actionRouter.post(
  '/create/one',
  validateSchema({
    body: ActionInsertSchema.pick({
      name: true
    })
  }),
  createOne
);

export default actionRouter;
