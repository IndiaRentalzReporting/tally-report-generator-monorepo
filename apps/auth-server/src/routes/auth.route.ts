import { Router } from 'express';
import {
  TenantInsertSchema,
  UserInsertSchema
} from '@trg_package/schemas-auth/types';
import { validateSchema } from '@trg_package/middlewares';
import z from 'zod';
import {
  onboard,
  handleSignIn,
  handleSignUp,
  handleStatusCheck,
  handleSignOut
} from '../controller/auth.controller';
import { authenticate } from '../middlewares';

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
  validateSchema({
    body: UserInsertSchema.extend({
      password: UserInsertSchema.shape.password.min(8)
    }).pick({
      first_name: true,
      last_name: true,
      email: true,
      password: true
    })
  }),
  handleSignUp
);

authRouter.post('/sign-out', handleSignOut);

authRouter.get('/status', handleStatusCheck);

export default authRouter;
