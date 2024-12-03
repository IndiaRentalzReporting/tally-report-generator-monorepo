import { Router } from 'express';
import { validateSchema } from '@trg_package/express/middlewares';
import { ActionInsertSchema, ActionSelectSchema } from '@trg_package/schemas-dashboard/types';
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
    query: ActionSelectSchema.partial()
  }),
  readAll
);
actionRouter.patch(
  '/update/:id',
  validateSchema({
    body: ActionSelectSchema.pick({
      name: true
    }).partial(),
    params: ActionSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);
actionRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ActionSelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default actionRouter;
