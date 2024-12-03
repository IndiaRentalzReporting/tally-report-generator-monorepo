import { Router } from 'express';
import { validateSchema } from '@trg_package/express/middlewares';
import { UserInsertSchema } from '@trg_package/schemas-auth/types';
import {
  readAll,
  deleteOne,
  updateOne
} from '../controller/user.controller';

const userRouter = Router();

userRouter.get(
  '/read',
  validateSchema({ query: UserInsertSchema.partial() }),
  readAll
);

userRouter.patch(
  '/update/:id',
  validateSchema({
    body: UserInsertSchema.pick({
      email: true,
      password: true
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
