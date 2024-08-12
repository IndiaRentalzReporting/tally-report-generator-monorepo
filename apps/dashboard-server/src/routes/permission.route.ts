import { Router } from 'express';
import z from 'zod';
import {
  createMany,
  readAll,
  readAllOfRole,
  updateMany
} from '../controller/permission.controller';
import { validateSchema } from '@fullstack_package/core-application/middlewares';
import {
  ModuleSelectSchema,
  ActionSelectSchema,
  RoleSelectSchema,
  PermissionSelectSchema
} from '../models/schema';

const permissionRouter = Router();

permissionRouter.get('/read', readAll);

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
