import { Router } from 'express';
import { create, getAll } from '../controller/module.controller';

const moduleRouter = Router();

moduleRouter.post('/create', create);
moduleRouter.get('/all', getAll);

export default moduleRouter;
