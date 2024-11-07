import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  PermissionSelectSchema,
  PermissionInsertSchema
} from '@trg_package/schemas-dashboard/types';
import {
  createOne,
  deleteOne,
  readAll,
  updateOne
} from '../controller/permission.controller';

const permissionRouter = Router();

permissionRouter.post(
  '/create',
  validateSchema({
    body: PermissionInsertSchema.pick({
      module_id: true,
      role_id: true
    })
  }),
  createOne
);

permissionRouter.get(
  '/read',
  validateSchema({
    query: PermissionSelectSchema.partial()
  }),
  readAll
);

permissionRouter.post(
  '/update/:id',
  validateSchema({
    body: PermissionSelectSchema.pick({
      module_id: true,
      role_id: true
    }).partial(),
    params: PermissionSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);

permissionRouter.delete(
  '/delete/:id',
  validateSchema({
    params: PermissionSelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default permissionRouter;
