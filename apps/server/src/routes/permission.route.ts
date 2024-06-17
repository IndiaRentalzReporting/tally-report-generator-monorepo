import { Router } from 'express';
import z from 'zod';
import { createMany } from '../controller/permission.controller';
import { validateSchema } from '../middlewares';
import {
  ModuleSelectSchema,
  ActionSelectSchema,
  RoleSelectSchema
} from '../models/schema';

const permissionRouter = Router();

permissionRouter.post(
  '/create/many',
  validateSchema({
    body: z.object({
      permissions: z.array(
        z.object({
          module_id: ModuleSelectSchema.shape.id,
          action_id: ActionSelectSchema.shape.id
        })
      ),
      role_id: RoleSelectSchema.shape.id
    })
  }),
  createMany
);

export default permissionRouter;
