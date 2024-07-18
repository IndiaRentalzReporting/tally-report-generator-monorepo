import { Router } from 'express';
import * as z from 'zod';
import { ColumnType } from '@fullstack_package/interfaces';
import {
  createOne,
  readAll,
  updateOne,
  deleteOne,
  readOne
} from '../controller/module.controller';
import { validateSchema } from '../middlewares';
import { ModuleInsertSchema } from '../models/schema';

const moduleRouter = Router();

moduleRouter.post(
  '/create',
  validateSchema({
    body: z.object({
      moduleDetails: ModuleInsertSchema.pick({
        name: true,
        isPrivate: true,
        icon: true
      }),
      columnDetails: z.array(
        z.object({
          name: z.string(),
          type: z.custom((val) => val in ColumnType)
        })
      )
    })
  }),
  createOne
);
moduleRouter.get('/read', readAll);
moduleRouter.get(
  '/read/:id',
  validateSchema({
    params: ModuleInsertSchema.pick({
      id: true
    })
  }),
  readOne
);
moduleRouter.patch(
  '/update/:id',
  validateSchema({
    body: ModuleInsertSchema.extend({
      name: ModuleInsertSchema.shape.name.optional(),
      isPrivate: ModuleInsertSchema.shape.isPrivate.optional(),
      icon: ModuleInsertSchema.shape.icon.optional()
    }).pick({
      name: true,
      isPrivate: true,
      icon: true
    }),
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
