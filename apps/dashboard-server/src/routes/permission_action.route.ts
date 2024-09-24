import { Router } from 'express';
import {
  createOne,
  readAll,
  updateOne,
  deleteOne
} from '../controller/permission_action.controller';
import { validateSchema } from '@trg_package/middlewares';
import {
  PermissionActionSelectSchema,
  PermissionActionInsertSchema
} from '@trg_package/schemas-dashboard/types';

const permissionActionRouter = Router();

permissionActionRouter.post(
  '/create',
  validateSchema({
    body: PermissionActionInsertSchema.pick({
      action_id: true,
      permission_id: true
    })
  }),
  createOne
);

permissionActionRouter.get(
  '/read',
  validateSchema({
    query: PermissionActionSelectSchema.partial()
  }),
  readAll
);

permissionActionRouter.post(
  '/update/:action_id/:permission_id',
  validateSchema({
    body: PermissionActionSelectSchema.pick({
      action_id: true,
      permission_id: true
    }),
    params: PermissionActionSelectSchema.pick({
      action_id: true,
      permission_id: true
    })
  }),
  updateOne
);

permissionActionRouter.delete(
  '/delete/:action_id/:permission_id',
  validateSchema({
    params: PermissionActionInsertSchema.pick({
      action_id: true,
      permission_id: true
    })
  }),
  deleteOne
);

export default permissionActionRouter;
