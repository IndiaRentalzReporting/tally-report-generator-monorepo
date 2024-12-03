import { validateSchema } from '@trg_package/express/middlewares';
import { TenantSelectSchema, UserTenantSelectSchema } from '@trg_package/schemas-auth/types';
import { Router } from 'express';
import { isAuthenticated } from '@/middlewares';
import { handleCreateTeam, handleSwitchTeam } from '@/controller/auth.controller/teams';

const teamsAuthRouter = Router();

teamsAuthRouter.post(
  '/switch',
  isAuthenticated,
  validateSchema({
    body: UserTenantSelectSchema.pick({
      tenant_id: true
    })
  }),
  handleSwitchTeam
);

teamsAuthRouter.post(
  '/create',
  isAuthenticated,
  validateSchema({
    body: TenantSelectSchema.pick({
      name: true
    })
  }),
  handleCreateTeam
);

export default teamsAuthRouter;
