import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { ReportInsertSchema, ReportSelectSchema } from '@trg_package/schemas-reporting/types';
import {
  createOne, deleteOne, readAll, updateOne
} from '../controller/report.controller';

const reportRouter = Router();

reportRouter.post(
  '/create',
  validateSchema(
    {
      body: ReportInsertSchema.pick({
        name: true,
        baseEntity: true,
        description: true
      })
    }
  ),
  createOne
);

reportRouter.get(
  '/read',
  readAll
);

reportRouter.patch(
  '/update/:id',
  validateSchema({
    body: ReportInsertSchema,
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);

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
