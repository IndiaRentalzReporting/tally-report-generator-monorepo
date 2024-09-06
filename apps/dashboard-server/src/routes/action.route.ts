import { Router } from 'express';
import {
  createOne,
  deleteOne,
  readAll,
  updateOne,
  readOne
} from '../controller/action.controller';
import { validateSchema } from '@trg_package/middlewares';
import { ActionInsertSchema } from '@trg_package/dashboard-schemas/types';

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
actionRouter.get('/read', readAll);
actionRouter.get(
  '/read/:id',
  validateSchema({
    params: ActionInsertSchema.pick({
      id: true
    })
  }),
  readOne
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
