import { Request, Response, NextFunction } from 'express';
import {
  UserTallyCompanySelect,
  UserTallyCompanyInsert
} from '@trg_package/schemas-dashboard/types';
import { ReadError } from '@trg_package/errors';

export const createOne = async (
  req: Request<object, object, UserTallyCompanyInsert>,
  res: Response<{ userTallyCompany: UserTallyCompanySelect }>,
  next: NextFunction
) => {
  try {
    const { user_id, tallyCompany_id } = req.body;
    const userTallyCompany = await req.services.userTallyCompany.createOne({
      user_id,
      tallyCompany_id
    });
    res.json({ userTallyCompany });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object, object, object, Partial<UserTallyCompanySelect>>,
  res: Response<{ userTallyCompanys: UserTallyCompanySelect[] }>,
  next: NextFunction
) => {
  try {
    const userTallyCompanys = await req.services.userTallyCompany.findMany({
      ...req.query
    }).catch((e) => {
      if (e instanceof ReadError) return [];
      throw e;
    });
    res.json({ userTallyCompanys });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<
  Pick<UserTallyCompanySelect, 'user_id' | 'tallyCompany_id'>,
  object,
  Partial<UserTallyCompanySelect>
  >,
  res: Response<{ userTallyCompany: UserTallyCompanySelect }>,
  next: NextFunction
) => {
  try {
    const { user_id: oldActionId, tallyCompany_id: oldPermissionId } = req.params;
    const { user_id, tallyCompany_id } = req.body;
    const userTallyCompany = await req.services.userTallyCompany.updateOne(
      { user_id: oldActionId, tallyCompany_id: oldPermissionId },
      {
        user_id,
        tallyCompany_id
      }
    );
    return res.json({
      userTallyCompany
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<UserTallyCompanySelect, 'user_id' | 'tallyCompany_id'>>,
  res: Response<{ permission: UserTallyCompanySelect }>,
  next: NextFunction
) => {
  try {
    const { user_id, tallyCompany_id } = req.params;
    const permission = await req.services.userTallyCompany.deleteOne({
      user_id,
      tallyCompany_id
    });
    return res.json({ permission });
  } catch (e) {
    return next(e);
  }
};
