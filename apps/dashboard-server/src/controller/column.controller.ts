import { ColumnSelect, TableSelect } from "@trg_package/schemas-reporting/types";
import { NextFunction, Request, Response } from "express";

export const readAll = async <ResObject extends {columns : ColumnSelect[]}>(
    req : Request<Pick<TableSelect,'id'>,ResObject>,
    res : Response<ResObject>,
    next : NextFunction
)  => {
    try{
        const columns = await req.columnService.getAllColumns(req.params.id);
        return res.json({columns} as ResObject)
    }   
    catch(e)
    {
        next(e);
    } 
}