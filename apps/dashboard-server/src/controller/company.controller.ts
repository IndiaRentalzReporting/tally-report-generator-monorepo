import { NextFunction, Request, Response } from 'express';
import { CompanySchema } from '@trg_package/schemas-tally/schemas';
import { TallySchemas, TallyTypes } from '../schemas/tally.schemas';
import { NotFoundError } from '@trg_package/errors';
import { sql } from 'drizzle-orm';
import { CompanyService } from '@trg_package/schemas-tally/services';
import {
  CompanySelect,
  GroupInsert,
  LedgerInsert,
  StockCategoryInsert,
  StockGroupInsert,
  StockItemInsert
} from '@trg_package/schemas-tally/types';

const getSchemas = async (name: keyof typeof TallyTypes) => {
  const model = TallySchemas[name];
  return model;
};

const getClient = async () => {};

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

export const syncData = async <DataKey extends keyof typeof TallyTypes>(
  req: Request<
    Pick<CompanySelect, 'guid'>,
    object,
    {
      group: Array<GroupInsert>;
      stockCategory: Array<StockCategoryInsert>;
      stockGroup: Array<StockGroupInsert>;
      stockItem: Array<StockItemInsert>;
      ledger: Array<LedgerInsert>;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  req.body.
  //validate company
  let company: any;
  try {
    const service = new CompanyService(req.dashboardDb);
    company = await service.findOne({ guid: req.params.guid });
  } catch (err) {
    throw new Error('Company is not registered');
  }

  Object.keys(req.body).map(async (k) => {
    const db = req.dashboardDb;
    const entitySchemas = await getSchemas(k as DataKey);
    const tableSchema = entitySchemas.schema;
    const tempSchema = entitySchemas.tempSchema;
    const rows = req.body[k as DataKey].map(
      <ObjType extends (typeof tableSchema)['$inferInsert']>(
        obj: ObjType
      ): ObjType => {
        return { ...obj, companyId: company.id };
      }
    );
    try {
      await db.transaction(async (tx) => {
        await tx.execute(
          sql`DELETE FROM ${tempSchema} WHERE ${tempSchema.companyId} = ${company.id} `
        );
        await tx.insert(tempSchema).values(rows);
        await tx.execute(sql`DELETE FROM ${tableSchema} WHERE ${tableSchema.masterID} IN(
          SELECT ${tempSchema.masterID} FROM ${tempSchema}
          INNER JOIN ${tableSchema} on ${tableSchema.masterID} = ${tempSchema.masterID} 
          WHERE ${tableSchema.alterID} != ${tempSchema.alterID})
          `);
        const query = sql`
          INSERT INTO ${tableSchema} 
          SELECT * FROM ${tempSchema} 
          WHERE ${tempSchema.masterID} NOT IN (
            SELECT ${tableSchema.masterID} FROM ${tableSchema}
          );  
        `;
        await tx.execute(query);
      });
    } catch (err) {
      throw err;
    }
  });
  return res.json({ success: true });
};
