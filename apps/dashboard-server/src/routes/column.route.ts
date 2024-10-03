import { validateSchema } from "@trg_package/middlewares";
import { readAll } from "../controller/column.controller";
import { Router } from "express";
import { TableSelectSchema } from "@trg_package/schemas-reporting/types";
import z from "zod";

const columnRouter = Router();

columnRouter.get(
    "/read/:tableId",
    validateSchema({
        params: z.object({
            tableId : TableSelectSchema.shape.id
        })
    }),
    readAll
);

export default columnRouter;