import {
  type UserInsert,
  type UserSelect,
  UserInsertSchema,
  UserSelectSchema
} from '../schemas/user';
import { TenantSelect } from './tenant';

type RegisterUser = Pick<
  UserInsert,
  'email' | 'password' | 'first_name' | 'last_name'
>;

type LoginUser = Pick<UserInsert, 'email' | 'password'>;

type DetailedUser = UserSelect & {
  tenant: TenantSelect;
};

type SafeUserSelect = Omit<DetailedUser, 'password'>;

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
