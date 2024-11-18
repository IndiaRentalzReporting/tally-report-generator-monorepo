import { Router } from 'express';
import {
  TenantInsertSchema,
  UserInsertSchema as AuthUserInsertSchema
} from '@trg_package/schemas-auth/types';
import { validateSchema } from '@trg_package/middlewares';
import z from 'zod';
import { UserInsertSchema as DashboardUserInsertSchema } from '@trg_package/schemas-dashboard/types';
import {
  onboard,
  handleSignIn,
  handleSignUp,
  handlePublicStatusCheck,
  handleSignOut,
  handlePrivateStatusCheck,
  checkPasswordResetToken,
  forgotPassword,
  resetPassword
} from '../controller/auth.controller';
import { authenticate, isAuthenticated } from '../middlewares';

const authRouter = Router();

authRouter.post(
  '/onboard',
  validateSchema({
    body: z.object({
      tenant: TenantInsertSchema.pick({
        name: true
      }),
      user: DashboardUserInsertSchema.pick({
        first_name: true,
        last_name: true,
      }).extend({
        email: AuthUserInsertSchema.shape.email,
        password: AuthUserInsertSchema.shape.password
      })
    })
  }),
  onboard
);

authRouter.post(
  '/sign-in',
  validateSchema({
    body: AuthUserInsertSchema.pick({
      email: true,
      password: true
    })
  }),
  authenticate,
  handleSignIn
);

authRouter.post(
  '/sign-up',
  isAuthenticated,
  validateSchema({
    body: DashboardUserInsertSchema.pick({
      first_name: true,
      last_name: true,
      role_id: true
    }).extend({
      email: AuthUserInsertSchema.shape.email
    })
  }),
  handleSignUp
);

authRouter.post('/sign-out', handleSignOut);

authRouter.get('/status', handlePublicStatusCheck);

authRouter.get('/_status', isAuthenticated, handlePrivateStatusCheck);

authRouter.post(
  '/forgot-password',
  validateSchema({
    body: AuthUserInsertSchema.pick({
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
  }),
  checkPasswordResetToken
);

authRouter.post(
  '/reset-password/:token',
  validateSchema({
    body: AuthUserInsertSchema.pick({
      password: true
    }).extend({
      confirmPassword: AuthUserInsertSchema.shape.password
    }),
    params: z
      .object({
        token: z.string()
      })
  }),
  resetPassword
);

export default authRouter;
