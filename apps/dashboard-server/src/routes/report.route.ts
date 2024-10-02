import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { createOne, deleteOne, readAll, updateOne } from '../controller/report.controller';
import { ReportInsertSchema, ReportSelectSchema } from '@trg_package/schemas-reporting/types';


const reportRouter = Router();

reportRouter.post(
    "/create",
    validateSchema(
        {
            body : ReportInsertSchema.pick({
                name : true,
                baseEntity : true,
                description : true
            })
        }
    ),
    createOne
);

reportRouter.get(
    '/read',
    validateSchema({
      query: ReportSelectSchema.pick({
        id : true
      })
    }),
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
