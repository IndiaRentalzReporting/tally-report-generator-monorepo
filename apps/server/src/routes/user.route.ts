import { Router } from 'express';
import { updateRole, readAll } from '../controller/user.controller';

const userRouter = Router();

userRouter.get('/read/all', readAll);
userRouter.post('/update/role', updateRole);

export default userRouter;
