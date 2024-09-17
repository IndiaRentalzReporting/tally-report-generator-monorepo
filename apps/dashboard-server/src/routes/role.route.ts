import { Router } from 'express';
import {
  createOne,
  readAll,
  updateOne,
  readOne,
  deleteOne
} from '../controller/role.controller';
import { validateSchema } from '@trg_package/middlewares';
import { RoleInsertSchema } from '@trg_package/schemas-dashboard/types';

const roleRouter = Router();

roleRouter.get('/read', readAll);
roleRouter.get(
  '/read/:id',
  validateSchema({
    params: RoleInsertSchema.pick({
      id: true
    })
  }),
  readOne
);
roleRouter.post(
  '/create',
  validateSchema({
    body: RoleInsertSchema.pick({
      name: true
    })
  }),
  createOne
);
roleRouter.patch(
  '/update/:id',
  validateSchema({
    body: RoleInsertSchema.pick({
      name: true
    }),
    params: RoleInsertSchema.pick({
      id: true
    })
  }),
  updateOne
);
roleRouter.delete(
  '/delete/:id',
  validateSchema({
    params: RoleInsertSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default roleRouter;
