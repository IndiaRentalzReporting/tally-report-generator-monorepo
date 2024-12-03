import { validateSchema } from '@trg_package/express/middlewares';
import { Router } from 'express';
import z from 'zod';
import { UserInsertSchema } from '@trg_package/schemas-auth/types';
import {
  forgotPassword,
  resetPassword
} from '@/controller/auth.controller/password';

const passwordAuthRouter = Router();

passwordAuthRouter.post(
  '/forgot',
  validateSchema({
    body: UserInsertSchema.pick({
      email: true
    })
  }),
  forgotPassword
);

passwordAuthRouter.post(
  '/reset/:token',
  validateSchema({
    body: UserInsertSchema.pick({
      password: true
    }).extend({
      confirmPassword: UserInsertSchema.shape.password
    }),
    params: z
      .object({
        token: z.string()
      })
  }),
  resetPassword
);

export default passwordAuthRouter;
