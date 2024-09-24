import { Router } from 'express';
import z from 'zod';
import {
  createMany,
  createOne,
  readAll,
  readAllOfRole,
  updateMany,
  updateOne,
  readOne
} from '../controller/permission.controller';
import { validateSchema } from '@trg_package/middlewares';
import {
  ModuleSelectSchema,
  ActionSelectSchema,
  RoleSelectSchema,
  PermissionSelectSchema,
  PermissionInsertSchema
} from '@trg_package/schemas-dashboard/types';

const permissionRouter = Router();

permissionRouter.get('/read', readAll);

permissionRouter.get(
  '/read/:id',
  validateSchema({
    params: PermissionSelectSchema.pick({
      id: true
    })
  }),
  readOne
);

permissionRouter.get(
  '/read/:role_id',
  validateSchema({
    params: PermissionSelectSchema.pick({
      role_id: true
    })
  }),
  readAllOfRole
);

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

permissionRouter.post(
  '/create/many',
  validateSchema({
    body: z.object({
      permissions: z.array(
        z.object({
          module_id: ModuleSelectSchema.shape.id,
          action_ids: z.array(ActionSelectSchema.shape.id)
        })
      ),
      role_id: RoleSelectSchema.shape.id
    })
  }),
  createMany
);

permissionRouter.post(
  '/update/:id',
  validateSchema({
    body: PermissionSelectSchema.pick({
      module_id: true,
      role_id: true
    }),
    params: PermissionSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);

permissionRouter.post(
  '/update/many',
  validateSchema({
    body: z.object({
      permissions: z.array(
        z.object({
          permission_id: PermissionSelectSchema.shape.id,
          module_id: ModuleSelectSchema.shape.id,
          action_ids: z.array(ActionSelectSchema.shape.id)
        })
      ),
      role_id: RoleSelectSchema.shape.id
    })
  }),
  updateMany
);

export default permissionRouter;
