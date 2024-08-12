import { Router } from 'express';
import { UserInsertSchema } from '../models/auth/schema';
import {
  handleSignUp,
  handleSignIn,
  handleStatusCheck,
  handleLogout
} from '../controller/auth.controller';
import {
  authenticate,
  validateSchema
} from '@fullstack_package/core-application/middlewares';

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

authRouter.post('/sign-out', handleLogout);

authRouter.get('/status', handleStatusCheck);

export default authRouter;
