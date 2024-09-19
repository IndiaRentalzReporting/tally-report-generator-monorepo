import { NextFunction, Request, Response } from 'express';
import { CompanySchema } from '@trg_package/schemas-tally/schemas';
import { NotFoundError } from '@trg_package/errors';
import {
  CompanyService,
  GroupService,
  LedgerService,
  StockCategoryService,
  StockGroupService,
  StockItemService
} from '@trg_package/schemas-tally/services';
import { CompanySelect } from '@trg_package/schemas-tally/types';

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

const TallyServices = {
  ledger: LedgerService,
  group: GroupService,
  stockCategory: StockCategoryService,
  stockGroup: StockGroupService,
  stockItem: StockItemService
};

type ServiceKey = keyof typeof TallyServices;

type SyncData = {
  [K in ServiceKey]?: InstanceType<(typeof TallyServices)[K]> extends {
    sync(data: infer D, companyId: string): Promise<any>;
  }
    ? D
    : never;
};

export const syncData = async (
  req: Request<Pick<CompanySelect, 'guid'>, object, SyncData>,
  res: Response,
  next: NextFunction
) => {
  const service = new CompanyService(req.dashboardDb);
  const company = await service.findOne({ guid: req.params.guid });

  for (const [key, data] of Object.entries(req.body)) {
    const typedKey = key as keyof typeof req.body;

    const EntityService = TallyServices[typedKey];
    const entityService = new EntityService(req.dashboardDb);

    // Type assertion here is safe because we've checked the key
    await entityService.sync(data as any, company.id);
  }

  return res.json({ success: true });
};
