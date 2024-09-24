import { Router } from 'express';
import {
  createOne,
  deleteOne,
  readAll,
  updateOne
} from '../controller/apiKey.controller';
import { validateSchema } from '@trg_package/middlewares';
import { ApiKeyInsertSchema } from '@trg_package/schemas-dashboard/types';

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
    query: ApiKeyInsertSchema.partial()
  }),
  readAll
);
apiKeyRouter.patch(
  '/update/:id',
  validateSchema({
    body: ApiKeyInsertSchema.pick({
      name: true
    }),
    params: ApiKeyInsertSchema.pick({
      id: true
    })
  }),
  updateOne
);
apiKeyRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ApiKeyInsertSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default apiKeyRouter;
