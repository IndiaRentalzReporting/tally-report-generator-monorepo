import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { UserSelectSchema } from '@trg_package/schemas-dashboard/types';
import {
  deleteOne,
  updateOne
} from '../controller/userMe.controller';

const userMeRouter = Router();

userMeRouter.patch(
  '/update',
  validateSchema({
    body: UserSelectSchema.pick({
      first_name: true,
      last_name: true,
      role_id: true,
      status: true,
    }).partial(),
  }),
  updateOne
);

userMeRouter.delete(
  '/delete',
  deleteOne
);

export default userMeRouter;
