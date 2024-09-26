import { readAll } from "@/controller/column.controller";
import { Router } from "express";

const columnRouter = Router();

columnRouter.get(
    "/read",
    readAll
);

export default columnRouter;