import {
  type UserInsert,
  type UserSelect,
  UserInsertSchema,
  UserSelectSchema
} from '../schemas/users';
import { TenantSelect } from './tenants';

type DetailedUser = UserSelect & {
  tenant: TenantSelect;
};

export {
  UserInsert,
  UserSelect,
  type DetailedUser,
  UserInsertSchema,
  UserSelectSchema
};
