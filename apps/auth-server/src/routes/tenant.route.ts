import { z } from 'zod';
import { Router } from 'express';
import {
  readAll,
  deleteOne,
  updateOne,
  createOne
} from '../controller/tenant.controller';
import { validateSchema } from '@trg_package/middlewares';
import {
  TenantInsertSchema,
  TenantSelectSchema
} from '@trg_package/schemas-auth/types';

const tenantRouter = Router();

tenantRouter.get(
  '/read',
  validateSchema({
    query: TenantSelectSchema.partial()
  }),
  readAll
);

tenantRouter.post(
  '/create',
  validateSchema({
    body: z.object({
      tenant: TenantInsertSchema.pick({
        name: true
      })
    })
  }),
  createOne
);

tenantRouter.patch(
  '/update/:id',
  validateSchema({
    body: TenantInsertSchema.pick({
      name: true,
      status: true,
      isReadonly: true,
      deletedAt: true,
      approvedAt: true
    }).partial(),
    params: TenantInsertSchema.pick({
      id: true
    })
  }),
  updateOne
);

tenantRouter.delete(
  '/delete/:id',
  validateSchema({
    params: TenantInsertSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default tenantRouter;
