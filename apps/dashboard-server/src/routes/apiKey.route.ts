import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { ApiKeyInsertSchema, ApiKeySelectSchema } from '@trg_package/schemas-dashboard/types';
import {
  createOne,
  deleteOne,
  readAll,
  updateOne
} from '../controller/apiKey.controller';

const apiKeyRouter = Router();

apiKeyRouter.post(
  '/create',
  validateSchema({
    body: ApiKeyInsertSchema.pick({
      name: true
    })
  }),
  createOne
);
apiKeyRouter.get(
  '/read',
  validateSchema({
    query: ApiKeySelectSchema.partial()
  }),
  readAll
);
apiKeyRouter.patch(
  '/update/:id',
  validateSchema({
    body: ApiKeySelectSchema.pick({
      name: true
    }).partial(),
    params: ApiKeySelectSchema.pick({
      id: true
    })
  }),
  updateOne
);
apiKeyRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ApiKeySelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default apiKeyRouter;
