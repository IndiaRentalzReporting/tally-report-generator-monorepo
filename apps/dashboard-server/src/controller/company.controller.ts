import { NextFunction, Request, Response } from 'express';
import { CompanySchema } from '@trg_package/schemas-tally/schemas';
import {  TallyServices } from '../schemas/tally.schemas';
import { NotFoundError } from '@trg_package/errors';
import { sql } from 'drizzle-orm';
import { CompanyService, GroupService } from '@trg_package/schemas-tally/services';
import * as Schemas from '@trg_package/schemas-tally/schemas';
import { CompanySelect, GroupInsert, LedgerInsert, StockCategoryInsert, StockGroupInsert, StockItemInsert } from '@trg_package/schemas-tally/types';

const getService = <T extends keyof typeof TallyServices>(name : T) : typeof TallyServices[T] => {
  const model = TallyServices[name];
  return model;
};

export const readOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = new CompanyService(req.dashboardDb);
    const company = await service.findOne({
      guid: req.params.guid
    });
    return res.json({ company });
  } catch (e) {
    console.error("Couldn't fetch Company, Register It First");
    return next(e);
  }
};

export const createOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = new CompanyService(req.dashboardDb);
    try {
      const c = await service.findOne({ guid: req.body.guid });
      throw new Error('Company already Exists');
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw err;
      }
    }

    const result = await service.createOne(req.body);
    return res.json({ result });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const readAll = async (
  req: Request,
  res: Response<{ companies: Partial<typeof CompanySchema.$inferInsert>[] }>,
  next: NextFunction
) => {
  try {
    const service = new CompanyService(req.dashboardDb);
    const companies = await service.findMany();

    return res.json({ companies });
  } catch (e) {
    console.error("Couldn't fetch all Companies");
    return next(e);
  }
};
export const syncData = async <DataKey extends keyof typeof TallyServices>(
  req: Request<
    Pick<CompanySelect,"guid">,
    any,
    Partial<{
      ledger :typeof Schemas['LedgerSchema']['$inferInsert'][],
      group : typeof Schemas['GroupSchema']['$inferInsert'][],
      stockCategory : typeof Schemas['StockCategorySchema']['$inferInsert'][],
      stockGroup : typeof Schemas['StockGroupSchema']['$inferInsert'][],
      stockItem : any
    }>
    >,
  res: Response,
  next: NextFunction
) => {
  //validate company
  let company: any;
  try {
    const service = new CompanyService(req.dashboardDb);
    company = await service.findOne({ guid: req.params.guid });
  } catch (err) {
    throw new Error('Company is not registered');
  }

  Object.keys(req.body).map(async(k) => {
    const db = req.dashboardDb;
    const entityService = getService(k as DataKey);
    try{
      const service = new entityService(db);
      service.sync(req.body[k as keyof typeof req.body], company.id);
    } catch (err) {
      throw err;
    }
  });
  return res.json({ success: true });
};
