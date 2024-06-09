import { Router } from 'express';
import { assignRole, getAllUsers } from '../controller/user.controller';

const userRouter = Router();

userRouter.get('/all', getAllUsers);
userRouter.post('/assignRole', assignRole);

export default userRouter;
