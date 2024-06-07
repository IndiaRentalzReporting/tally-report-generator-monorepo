import { Router } from 'express';
import { User as ZodUserSchema } from '@fullstack_package/interfaces';
import {
  handleSignUp,
  handleSignIn,
  handleStatusCheck,
  handleLogout
} from '../controller/auth.controller';
import { authenticate, validateSchema } from '../middlewares';

const authRouter = Router();

authRouter.post(
  '/sign-in',
  validateSchema({
    body: ZodUserSchema.pick({ email: true, password: true })
  }),
  authenticate,
  handleSignIn
);
authRouter.post(
  '/sign-up',
  validateSchema({
    body: ZodUserSchema.omit({
      id: true,
      created_at: true,
      updated_at: true
    })
  }),
  handleSignUp
);

authRouter.get('/status', handleStatusCheck);

authRouter.post('/sign-out', handleLogout);

export default authRouter;
