import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { UserInsertSchema, UserSelectSchema } from '@trg_package/schemas-dashboard/types';
import {
  createOne,
  readAll,
  deleteOne,
  updateOne
} from '../controller/user.controller';

const userRouter = Router();

userRouter.post(
  '/create',
  validateSchema({
    body: UserInsertSchema.extend({
    }).pick({
      first_name: true,
      last_name: true,
      role_id: true,
    })
  }),
  createOne
);
userRouter.get(
  '/read',
  validateSchema({
    query: UserSelectSchema.partial()
  }),
  readAll
);
userRouter.patch(
  '/update/:id',
  validateSchema({
    body: UserSelectSchema.pick({
      first_name: true,
      last_name: true,
      role_id: true
    }).partial(),
    params: UserSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);
userRouter.delete(
  '/delete/:id',
  validateSchema({
    params: UserSelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default userRouter;
