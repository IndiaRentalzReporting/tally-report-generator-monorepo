import { Router } from 'express';
import {
  TenantInsertSchema,
} from '@trg_package/schemas-auth/types';
import { validateSchema } from '@trg_package/middlewares';
import z from 'zod';
import { UserInsertSchema } from '@trg_package/schemas-dashboard/types';
import {
  onboard,
  handleSignIn,
  handleSignUp,
  handlePublicStatusCheck,
  handleSignOut,
  handlePrivateStatusCheck
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
      user: UserInsertSchema.extend({
        password: UserInsertSchema.shape.password.min(8)
      }).pick({
        first_name: true,
        last_name: true,
        email: true,
        password: true
      })
    })
  }),
  onboard
);

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
    body: UserInsertSchema.extend({
      password: UserInsertSchema.shape.password.min(8)
    }).pick({
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      role_id: true
    })
  }),
  handleSignUp
);

authRouter.post('/sign-out', handleSignOut);

authRouter.get('/status', handlePublicStatusCheck);

authRouter.get('/_status', isAuthenticated, handlePrivateStatusCheck);

export default authRouter;
