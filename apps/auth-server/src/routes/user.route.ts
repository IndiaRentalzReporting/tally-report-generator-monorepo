import { Router } from 'express';
import {
  readOne,
  readAll,
  deleteOne,
  updateOne,
  createOne
} from '../controller/user.controller';
import { validateSchema } from '../middlewares';
import { UserInsertSchema } from '../models/schema';

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
    body: UserInsertSchema.extend({
      first_name: UserInsertSchema.shape.first_name.optional(),
      last_name: UserInsertSchema.shape.last_name.optional(),
      email: UserInsertSchema.shape.email.optional(),
      password: UserInsertSchema.shape.password.optional()
    }).pick({
      first_name: true,
      last_name: true,
      email: true,
      password: true
    }),
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
