import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { readAll } from '../controller/table.controller';

const tableRouter = Router();

tableRouter.get(
  '/read',
  readAll
);

export default tableRouter;
