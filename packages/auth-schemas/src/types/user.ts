import { type UserInsert, type UserSelect } from '../schemas/user';

type RegisterUser = Pick<
  UserInsert,
  'email' | 'password' | 'first_name' | 'last_name'
>;

type LoginUser = Pick<UserSelect, 'email' | 'password'>;

export { type UserInsert, type UserSelect, type RegisterUser, type LoginUser };
