import z from 'zod';
import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { UserInsertSchema as DashboardUserInsertSchema } from '@trg_package/schemas-dashboard/types';
import { TenantInsertSchema, UserInsertSchema as AuthUserInsertSchema } from '@trg_package/schemas-auth/types';
import signAuthRouter from './sign';
import teamsAuthRouter from './teams';
import statusAuthRouter from './status';
import passwordAuthRouter from './password';
import { onboard } from '@/controller/auth.controller';

const authRouter = Router();

authRouter.post(
  '/onboard',
  validateSchema({
    body: z.object({
      tenant: TenantInsertSchema.pick({
        name: true
      }),
      user: DashboardUserInsertSchema.pick({
        first_name: true,
        last_name: true,
      }).extend({
        email: AuthUserInsertSchema.shape.email,
        password: AuthUserInsertSchema.shape.password
      })
    })
  }),
  onboard
);

authRouter.use('/sign', signAuthRouter);
authRouter.use('/teams', teamsAuthRouter);
authRouter.use('/status', statusAuthRouter);
authRouter.use('/password', passwordAuthRouter);

export default authRouter;
