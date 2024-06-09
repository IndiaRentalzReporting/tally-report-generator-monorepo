import { Router } from 'express';
import { assignPermission, createRole } from '../controller/role.controller';

const roleRouter = Router();

roleRouter.post('/create', createRole);
roleRouter.post('/assignPermission', assignPermission);

export default roleRouter;
