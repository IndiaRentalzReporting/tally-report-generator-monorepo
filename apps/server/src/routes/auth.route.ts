import { Router } from 'express';
import { User as ZodUserSchema } from '@fullstack_package/interfaces';
import { handleRegister, handleLogin } from '../controller/auth.controller';
import { authenticate, validateSchema } from '../middlewares';

const authRouter = Router();

authRouter.post(
  '/login',
  validateSchema({
    body: ZodUserSchema.pick({ email: true, password: true })
  }),
  authenticate,
  handleLogin
);
authRouter.post(
  '/register',
  validateSchema({
    body: ZodUserSchema.omit({
      id: true,
      created_at: true,
      updated_at: true
    })
  }),
  handleRegister
);

export default authRouter;
