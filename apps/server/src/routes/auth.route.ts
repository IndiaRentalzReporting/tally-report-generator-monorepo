import { Router } from 'express';
import { Customer as ZodCustomerSchema } from '@fullstack_package/interfaces';
import { handleRegister, handleLogin } from '../controller/auth.controller';
import { authenticate, validateSchema } from '../middlewares';

const authRouter = Router();

authRouter.post(
  '/login',
  validateSchema({
    body: ZodCustomerSchema.pick({ email: true, password: true })
  }),
  authenticate,
  handleLogin
);
authRouter.post(
  '/register',
  validateSchema({
    body: ZodCustomerSchema.omit({
      id: true,
      created_at: true,
      updated_at: true
    })
  }),
  handleRegister
);

export default authRouter;
