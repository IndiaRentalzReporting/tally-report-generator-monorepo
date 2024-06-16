import { Router } from 'express';
import { assignRole, getAll } from '../controller/user.controller';

const userRouter = Router();

userRouter.get('/all', getAll);
userRouter.post('/assignRole', assignRole);

export default userRouter;
