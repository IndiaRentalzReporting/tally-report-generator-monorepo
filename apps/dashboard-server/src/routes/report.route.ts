import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { createOne } from '../controller/report.controller';
import { ReportInsertSchema } from '@trg_package/schemas-reporting/types';


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


export default reportRouter;
