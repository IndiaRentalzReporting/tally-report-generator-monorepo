import { Router } from 'express';
import {
  createOne,
  readAll,
  updateOne,
  deleteOne,
  readOne
} from '../controller/module.controller';
import { validateSchema } from '@trg_package/middlewares';
import { ModuleInsertSchema } from '@trg_package/dashboard-schemas/types';

const moduleRouter = Router();

moduleRouter.post(
  '/create',
  validateSchema({
    body: ModuleInsertSchema.pick({
      name: true,
      isPrivate: true,
      icon: true
    })
  }),
  createOne
);
moduleRouter.get(
  '/read/:id',
  validateSchema({
    params: ModuleInsertSchema.pick({
      id: true
    })
  }),
  readOne
);
moduleRouter.get('/read', readAll);
moduleRouter.patch(
  '/update/:id',
  validateSchema({
    body: ModuleInsertSchema.pick({
      name: true,
      isPrivate: true,
      icon: true
    }).partial(),
    params: ModuleInsertSchema.pick({
      id: true
    })
  }),
  updateOne
);
moduleRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ModuleInsertSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default moduleRouter;
