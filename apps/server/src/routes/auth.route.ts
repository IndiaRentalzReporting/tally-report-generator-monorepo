import { Router } from 'express';
import * as z from 'zod';
import { UserInsertSchema } from '../models/schema';
import {
  handleSignUp,
  handleSignIn,
  handleStatusCheck,
  handleLogout,
  createNewPassword
} from '../controller/auth.controller';
import { authenticate, isAuthenticated, validateSchema } from '../middlewares';

const authRouter = Router();

authRouter.post(
  '/sign-in',
  validateSchema({
    body: UserInsertSchema.pick({ email: true, password: true })
  }),
  authenticate,
  handleSignIn
);

authRouter.post(
  '/sign-up',
  validateSchema({
    body: UserInsertSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      role_id: true,
      password: true
    })
  }),
  isAuthenticated,
  handleSignUp
);

authRouter.post(
  '/create-password/:token',
  validateSchema({
    body: UserInsertSchema.pick({
      password: true
    }).extend({
      confirm_password: z.string()
    }),
    params: z
      .object({
        token: z.string()
      })
      .pick({
        token: true
      })
  }),
  createNewPassword
);

authRouter.post('/sign-out', handleLogout);

authRouter.get('/status', handleStatusCheck);

export default authRouter;
