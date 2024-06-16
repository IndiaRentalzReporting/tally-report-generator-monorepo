import { Router } from 'express';
import * as z from 'zod';
import {
  assignPermission,
  createOne,
  getAll
} from '../controller/role.controller';
import { validateSchema } from '../middlewares';
import {
  ActionSelectSchema,
  ModuleSelectSchema,
  RoleSelectSchema,
  RoleInsertSchema
} from '../models/schema';

const roleRouter = Router();

roleRouter.get('/all', getAll);
roleRouter.post(
  '/create',
  validateSchema({
    body: RoleInsertSchema.pick({
      name: true
    })
  }),
  createOne
);
roleRouter.post(
  '/assignPermission',
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
  assignPermission
);

export default roleRouter;
