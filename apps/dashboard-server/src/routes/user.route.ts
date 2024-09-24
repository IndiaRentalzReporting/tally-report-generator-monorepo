import { Router } from 'express';
import { readAll, deleteOne, updateOne } from '../controller/user.controller';
import { validateSchema } from '@trg_package/middlewares';
import { UserInsertSchema } from '@trg_package/schemas-dashboard/types';

const userRouter = Router();

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
