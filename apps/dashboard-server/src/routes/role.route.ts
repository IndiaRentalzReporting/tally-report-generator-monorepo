import { Router } from 'express';
import {
  createOne,
  readAll,
  updateOne,
  deleteOne
} from '../controller/role.controller';
import { validateSchema } from '@trg_package/middlewares';
import { RoleInsertSchema } from '@trg_package/schemas-dashboard/types';

const roleRouter = Router();

roleRouter.post(
  '/create',
  validateSchema({
    body: RoleInsertSchema.pick({
      name: true
    })
  }),
  createOne
);

roleRouter.get(
  '/read',
  validateSchema({
    query: RoleInsertSchema.partial()
  }),
  readAll
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
