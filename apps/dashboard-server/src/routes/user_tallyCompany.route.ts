import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  UserTallyCompanySelectSchema,
  UserTallyCompanyInsertSchema
} from '@trg_package/schemas-dashboard/types';
import {
  createOne,
  readAll,
  updateOne,
  deleteOne
} from '../controller/user_tallyCompany.controller';

const userTallyCompanyRouter = Router();

userTallyCompanyRouter.post(
  '/create',
  validateSchema({
    body: UserTallyCompanyInsertSchema.pick({
      user_id: true,
      tallyCompany_id: true
    })
  }),
  createOne
);

userTallyCompanyRouter.get(
  '/read',
  validateSchema({
    query: UserTallyCompanySelectSchema.partial()
  }),
  readAll
);

userTallyCompanyRouter.post(
  '/update/:user_id/:tallyCompany_id',
  validateSchema({
    body: UserTallyCompanySelectSchema.pick({
      user_id: true,
      tallyCompany_id: true
    }),
    params: UserTallyCompanySelectSchema.pick({
      user_id: true,
      tallyCompany_id: true
    })
  }),
  updateOne
);

userTallyCompanyRouter.delete(
  '/delete/:user_id/:tallyCompany_id',
  validateSchema({
    params: UserTallyCompanyInsertSchema.pick({
      user_id: true,
      tallyCompany_id: true
    })
  }),
  deleteOne
);

export default userTallyCompanyRouter;
