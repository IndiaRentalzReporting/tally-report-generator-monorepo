import { Router } from 'express';
import { validateSchema } from '@trg_package/express/middlewares';
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
    }).extend({
      status: UserSelectSchema.shape.status.refine(
        (status) => status === undefined || status === 'active',
        {
          message: 'Status can only be set to active.',
          path: ['status'],
        }
      )
    }).strict().partial()
  }),
  updateOne
);

userMeRouter.delete(
  '/delete',
  deleteOne
);

export default userMeRouter;
