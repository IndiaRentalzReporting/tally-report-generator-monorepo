import { Router } from 'express';
import {
  assignPermission,
  assignRole,
  createRole
} from '../controller/role.controller';

const roleRouter = Router();

roleRouter.post('/create', createRole);
roleRouter.post('/assignPermission', assignPermission);
roleRouter.post('/assignRole', assignRole);

export default roleRouter;
