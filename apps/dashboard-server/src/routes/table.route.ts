import { Router } from 'express';
import { readAll } from '../controller/table.controller';

const tableRouter = Router();

tableRouter.get(
  '/read',
  readAll
);

export default tableRouter;
