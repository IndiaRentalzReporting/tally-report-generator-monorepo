import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { RoleInsertSchema, RoleSelectSchema } from '@trg_package/schemas-dashboard/types';
import {
  createOne,
  readAll,
  updateOne,
  deleteOne
} from '../controller/role.controller';

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
    query: RoleSelectSchema.partial()
  }),
  readAll
);

roleRouter.patch(
  '/update/:id',
  validateSchema({
    body: RoleSelectSchema.pick({
      name: true
    }).partial(),
    params: RoleSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);

roleRouter.delete(
  '/delete/:id',
  validateSchema({
    params: RoleSelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default roleRouter;
