import { Router } from 'express';
import {
  createOne,
  readAll,
  updateOne,
  readOne,
  deleteOne
} from '../controller/permission_action.controller';
import { validateSchema } from '@trg_package/middlewares';
import {
  PermissionActionSelectSchema,
  PermissionActionInsertSchema
} from '@trg_package/schemas-dashboard/types';

const permissionActionRouter = Router();

permissionActionRouter.get('/read', readAll);

permissionActionRouter.get(
  '/read/:id',
  validateSchema({
    params: PermissionActionSelectSchema.pick({
      action_id: true,
      permission_id: true
    })
  }),
  readOne
);

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

permissionActionRouter.post(
  '/update/:id',
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
  '/delete/:id',
  validateSchema({
    params: PermissionActionInsertSchema.pick({
      action_id: true,
      permission_id: true
    })
  }),
  deleteOne
);

export default permissionActionRouter;
