import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { ActionInsertSchema } from '@trg_package/schemas-dashboard/types';
import {
  createOne,
  deleteOne,
  readAll,
  updateOne
} from '../controller/action.controller';

const actionRouter = Router();

actionRouter.post(
  '/create',
  validateSchema({
    body: ActionInsertSchema.pick({
      name: true
    })
  }),
  createOne
);
actionRouter.get(
  '/read',
  validateSchema({
    query: ActionInsertSchema.partial()
  }),
  readAll
);
actionRouter.patch(
  '/update/:id',
  validateSchema({
    body: ActionInsertSchema.pick({
      name: true
    }),
    params: ActionInsertSchema.pick({
      id: true
    })
  }),
  updateOne
);
actionRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ActionInsertSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default actionRouter;
