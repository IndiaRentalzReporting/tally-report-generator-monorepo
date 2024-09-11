import { Router } from 'express';
import {
  readOne,
  readAll,
  deleteOne,
  updateOne,
  createOne
} from '../controller/user.controller';
import { validateSchema } from '@trg_package/middlewares';
import { UserInsertSchema } from '@trg_package/schemas-auth/types';

const userRouter = Router();

userRouter.post(
  '/create',
  validateSchema({
    body: UserInsertSchema.pick({
      first_name: true,
      last_name: true,
      email: true,
      password: true
    })
  }),
  createOne
);

userRouter.get('/read', readAll);

userRouter.get(
  '/read/:id',
  validateSchema({
    params: UserInsertSchema.pick({
      id: true
    })
  }),
  readOne
);

userRouter.patch(
  '/update/:id',
  validateSchema({
    body: UserInsertSchema.pick({
      first_name: true,
      last_name: true,
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
