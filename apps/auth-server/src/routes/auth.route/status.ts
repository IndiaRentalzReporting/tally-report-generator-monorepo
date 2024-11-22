import { Router } from 'express';
import { handleStatusCheck } from '@/controller/auth.controller/status';

const statusAuthRouter = Router();

statusAuthRouter.get('/', handleStatusCheck);

export default statusAuthRouter;
