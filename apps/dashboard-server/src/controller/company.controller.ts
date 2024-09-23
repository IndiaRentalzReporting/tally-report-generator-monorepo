import { NextFunction, Request, Response } from 'express';
import {
  GroupService,
  LedgerService,
  StockCategoryService,
  StockGroupService,
  StockItemService
} from '@trg_package/schemas-tally/services';
import { CompanyInsert, CompanySelect } from '@trg_package/schemas-tally/types';

export const readOne = async (
  req: Request<Pick<CompanySelect, 'guid'>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await req.companyService.findOne({
      guid: req.params.guid
    });
    return res.json({ company });
  } catch (e) {
    console.error("Couldn't fetch Company, Register It First");
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, CompanyInsert>,
  res: Response<{ company: CompanySelect }>,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const company = await req.companyService.createOne(data);
    return res.json({ company });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request,
  res: Response<{ companies: Array<CompanySelect> }>,
  next: NextFunction
) => {
  try {
    const companies = await req.companyService.findMany();

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
  const company = await req.companyService.findOne({ guid: req.params.guid });

  for (const [key, data] of Object.entries(req.body)) {
    const typedKey = key as keyof typeof req.body;

    const EntityService = TallyServices[typedKey];
    const entityService = new EntityService(req.dashboardDb as any);

    // Type assertion here is safe because we've checked the key
    await entityService.sync(data as any, company.id);
  }

  return res.json({ success: true });
};
