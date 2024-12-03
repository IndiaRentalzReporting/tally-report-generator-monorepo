import { validateSchema } from '@trg_package/express/middlewares';
import { Router } from 'express';
import { UserInsertSchema as DashboardUserInsertSchema } from '@trg_package/schemas-dashboard/types';
import { UserInsertSchema as AuthUserInsertSchema } from '@trg_package/schemas-auth/types';
import { authenticate, isAuthenticated } from '@/middlewares';
import { handleSignIn, handleSignUp, handleSignOut } from '@/controller/auth.controller/sign';

const signAuthRouter = Router();

signAuthRouter.post(
  '/in',
  validateSchema({
    body: AuthUserInsertSchema.pick({
      email: true,
      password: true
    })
  }),
  authenticate,
  handleSignIn
);

signAuthRouter.post(
  '/up',
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

signAuthRouter.post('/out', handleSignOut);

export default signAuthRouter;
