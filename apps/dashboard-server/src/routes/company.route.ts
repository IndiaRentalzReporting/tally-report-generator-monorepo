import { Router } from "express";
import { validateSchema } from '@trg_package/middlewares';
import { company as CompanySchemas } from "@trg_package/tally-schemas/types";
import { createOne, readAll, readOne, syncData } from "../controller/company.controller";
import z, { any, AnyZodObject, ZodArray } from "zod";
import {TallyTypes} from "../schemas/tally.schemas"
import * as Types from "@trg_package/tally-schemas/types";


const companyRouter = Router();

companyRouter.post("/create",
    validateSchema({
        body : CompanySchemas['ZodInsertSchema']
    }),
    createOne
)


companyRouter.get("/read",
    readAll
)
companyRouter.get("/verify/:guid",
    validateSchema({
        params : CompanySchemas['ZodSelectSchema'].pick({guid : true})
    }),
    readOne
)


companyRouter.post("/sync/:guid",
    validateSchema({
        body : z.object(
            Object.fromEntries(
              Object.entries(Types).map(([key,model]) => 
                [key,z.array(model['ZodInsertSchema'].strict())]
            ) 
            ) as Record<string, ZodArray<AnyZodObject>>
          ).partial(),
          
        params : CompanySchemas['ZodSelectSchema'].pick({guid : true})
    }),
    syncData
)



export default companyRouter;