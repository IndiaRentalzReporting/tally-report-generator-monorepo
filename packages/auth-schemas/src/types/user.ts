import { type UserInsert, type UserSelect } from '../schemas/user';

type RegisterUser = Pick<
  UserInsert,
  'email' | 'password' | 'first_name' | 'last_name'
>;

type LoginUser = Pick<UserSelect, 'email' | 'password'>;

type SafeUserSelect = Omit<UserSelect, 'password'>;

export {
  UserInsert,
  UserSelect,
  type RegisterUser,
  type LoginUser,
  type SafeUserSelect
};
