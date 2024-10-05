import {
  type UserInsert,
  type UserSelect,
  UserInsertSchema,
  UserSelectSchema
} from '../schemas/users';
import { TenantSelect } from './tenants';

type RegisterUser = Pick<
UserInsert,
'email' | 'password' | 'first_name' | 'last_name'
>;

type LoginUser = Pick<UserInsert, 'email' | 'password'>;

type SafeUserSelect = Omit<UserSelect, 'password'>;

type DetailedUser = UserSelect & {
  tenant: TenantSelect;
};

export {
  UserInsert,
  UserSelect,
  type RegisterUser,
  type LoginUser,
  type SafeUserSelect,
  type DetailedUser,
  UserInsertSchema,
  UserSelectSchema
};
