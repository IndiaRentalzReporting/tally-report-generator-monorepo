import { Router } from 'express';
import { validateSchema } from '@trg_package/express/middlewares';
import { ModuleInsertSchema, ModuleSelectSchema } from '@trg_package/schemas-dashboard/types';
import {
  createOne,
  readAll,
  updateOne,
  deleteOne
} from '../controller/module.controller';

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
  '/read',
  validateSchema({
    query: ModuleSelectSchema.partial()
  }),
  readAll
);
moduleRouter.patch(
  '/update/:id',
  validateSchema({
    body: ModuleSelectSchema.pick({
      name: true,
      isPrivate: true,
      icon: true
    }).partial(),
    params: ModuleSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);
moduleRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ModuleSelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default moduleRouter;
