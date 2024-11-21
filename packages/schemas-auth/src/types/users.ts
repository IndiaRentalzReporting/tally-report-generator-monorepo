import {
  type UserInsert,
  type UserSelect,
  UserInsertSchema,
  UserSelectSchema
} from '../schemas/users';
import { TenantSelect } from './tenants';
import { UserTenantSelect } from './user_tenant';

type DetailedUser = UserSelect & {
  tenant: TenantSelect;
  userTenants: Array<UserTenantSelect & { tenant: TenantSelect }>;
};

export {
  UserInsert,
  UserSelect,
  type DetailedUser,
  UserInsertSchema,
  UserSelectSchema
};
