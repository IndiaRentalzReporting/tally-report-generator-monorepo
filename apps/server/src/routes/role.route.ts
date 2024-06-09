import { Router } from 'express';
import {
  assignPermission,
  create,
  getAll
} from '../controller/role.controller';

const roleRouter = Router();

roleRouter.get('/all', getAll);
roleRouter.post('/create', create);
roleRouter.post('/assignPermission', assignPermission);

export default roleRouter;
