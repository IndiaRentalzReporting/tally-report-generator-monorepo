import { Router } from 'express';
import { readAll } from '../controller/action.controller';

const actionRouter = Router();

actionRouter.get('/read/all', readAll);

export default actionRouter;
