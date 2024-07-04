import { Router } from 'express';
import { UserInsertSchema } from '../models/schema';
import {
  handleSignUp,
  handleSignIn,
  handleStatusCheck,
  handleLogout,
  sendEmailConfirmation
} from '../controller/auth.controller';
import { authenticate, validateSchema } from '../middlewares';

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
      role_id: true
    })
  }),
  // handleSignUp,
  sendEmailConfirmation
);

authRouter.post('/sign-out', handleLogout);

authRouter.get('/status', handleStatusCheck);

export default authRouter;
