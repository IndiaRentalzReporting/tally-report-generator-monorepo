import { Router } from 'express';
import { handleStatusCheck, handleLogout } from '../controller/auth.controller';

const authRouter = Router();

authRouter.post('/sign-out', handleLogout);

authRouter.get('/status', handleStatusCheck);

export default authRouter;
