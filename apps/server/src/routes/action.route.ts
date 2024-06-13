import { Router } from 'express';
import { getAll } from '../controller/action.controller';

const actionRouter = Router();

actionRouter.get('/all', getAll);

export default actionRouter;
