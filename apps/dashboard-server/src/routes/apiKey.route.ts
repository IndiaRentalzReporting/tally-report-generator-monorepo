import { Router } from 'express';
import {
  createOne,
  deleteOne,
  readAll,
  updateOne,
  readOne
} from '../controller/apiKey.controller';
import { validateSchema } from '@trg_package/middlewares';
import { ApiKeyInsertSchema } from '@trg_package/dashboard-schemas/types';

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
apiKeyRouter.get('/read', readAll);
apiKeyRouter.get(
  '/read/:id',
  validateSchema({
    params: ApiKeyInsertSchema.pick({
      id: true
    })
  }),
  readOne
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
