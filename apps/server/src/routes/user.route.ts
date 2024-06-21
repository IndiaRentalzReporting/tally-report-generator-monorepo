import { Router } from 'express';
import { updateRole, readAll, deleteOne } from '../controller/user.controller';

const userRouter = Router();

userRouter.get('/read', readAll);
userRouter.patch('/update/role', updateRole);
userRouter.delete('/delete/:id', deleteOne);

export default userRouter;
