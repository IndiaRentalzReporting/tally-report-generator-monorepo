import { Router } from 'express';
import * as z from 'zod';
import { UserInsertSchema } from '../models/schema';
import {
  handleSignUp,
  handleSignIn,
  handleStatusCheck,
  handleLogout,
  forgotPassword,
  resetPassword,
  checkPasswordResetToken
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
  isAuthenticated,
  validateSchema({
    body: UserInsertSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      role_id: true,
      password: true
    })
  }),
  handleSignUp
);

authRouter.post(
  '/forgot-password',
  validateSchema({
    body: UserInsertSchema.pick({
      email: true
    })
  }),
  forgotPassword
);

authRouter.post(
  '/check-reset-password/:token',
  validateSchema({
    params: z
      .object({
        token: z.string()
      })
      .pick({
        token: true
      })
  }),
  checkPasswordResetToken
);
authRouter.post(
  '/reset-password/:token',
  validateSchema({
    body: UserInsertSchema.pick({
      password: true
    }).extend({
      confirmPassword: z.string()
    }),
    params: z
      .object({
        token: z.string()
      })
      .pick({
        token: true
      })
  }),
  resetPassword
);

authRouter.post('/sign-out', handleLogout);

authRouter.get('/status', handleStatusCheck);

export default authRouter;
