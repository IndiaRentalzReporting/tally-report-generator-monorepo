import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  ReportSelectSchema,
  ReportInsertSchema
} from '@trg_package/schemas-reporting/types';
import {
  createOne,
  deleteOne
} from '../controller/report.controller';
import reportUpdateRouter from './reportUpdate.route';
import reportReadRouter from './reportRead.route';

const reportRouter = Router();

reportRouter.post(
  '/create',
  validateSchema({
    body: ReportInsertSchema.pick({
      name: true,
      baseEntity: true,
      description: true
    })
  }),
  createOne
);

reportRouter.use('/read',reportReadRouter);
reportRouter.use('/update',reportUpdateRouter);

reportRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default reportRouter;
