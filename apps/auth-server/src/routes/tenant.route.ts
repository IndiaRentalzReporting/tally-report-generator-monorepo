import { Router } from 'express';
import {
  readOne,
  readAll,
  deleteOne,
  updateOne,
  createOne
} from '../controller/tenant.controller';
import { validateSchema } from '../middlewares';
import { TenantInsertSchema } from '../models/auth/schema';

const tenantRouter = Router();

tenantRouter.get('/read', readAll);

tenantRouter.post(
  '/create',
  validateSchema({
    body: TenantInsertSchema.pick({
      name: true
    })
  }),
  createOne
);

tenantRouter.get(
  '/read/:id',
  validateSchema({
    params: TenantInsertSchema.pick({
      id: true
    })
  }),
  readOne
);

tenantRouter.patch(
  '/update/:id',
  validateSchema({
    body: TenantInsertSchema.extend({
      name: TenantInsertSchema.shape.name.optional(),
      status: TenantInsertSchema.shape.status.optional(),
      isReadonly: TenantInsertSchema.shape.isReadonly.optional(),
      deletedAt: TenantInsertSchema.shape.deletedAt.optional(),
      approvedAt: TenantInsertSchema.shape.approvedAt.optional()
    }).pick({
      name: true,
      status: true,
      isReadonly: true,
      deletedAt: true,
      approvedAt: true
    }),
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
