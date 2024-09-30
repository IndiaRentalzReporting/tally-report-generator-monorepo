import { Router } from 'express';
import {
  createOne,
  readAll,
  deleteOne,
  updateOne
} from '../controller/user.controller';
import { validateSchema } from '@trg_package/middlewares';
import { UserInsertSchema } from '@trg_package/schemas-dashboard/types';
import { UserInsertSchema as AuthUserInsertSchema } from '@trg_package/schemas-auth/types';

const userRouter = Router();

userRouter.post(
  '/create',
  validateSchema({
    body: UserInsertSchema.extend({
      tenant_id: AuthUserInsertSchema.shape.tenant_id
    }).pick({
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      tenant_id: true
    })
  }),
  createOne
);
userRouter.get(
  '/read',
  validateSchema({
    query: UserInsertSchema.partial()
  }),
  readAll
);
userRouter.patch(
  '/update/:id',
  validateSchema({
    body: UserInsertSchema.pick({
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      role_id: true
    }).partial(),
    params: UserInsertSchema.pick({
      id: true
    })
  }),
  updateOne
);
userRouter.delete(
  '/delete/:id',
  validateSchema({
    params: UserInsertSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default userRouter;
