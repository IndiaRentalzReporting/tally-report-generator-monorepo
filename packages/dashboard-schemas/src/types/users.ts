import {
  type UserInsert,
  type UserSelect,
  type DetailedUser,
  UserInsertSchema,
  UserSelectSchema,
  type UserRole
} from '../schemas/users';

type RegisterUser = Pick<
  UserInsert,
  'email' | 'password' | 'first_name' | 'last_name'
>;

type LoginUser = Pick<UserSelect, 'email' | 'password'>;

export {
  type RegisterUser,
  type LoginUser,
  type UserInsert,
  type UserSelect,
  type DetailedUser,
  type UserRole,
  UserInsertSchema,
  UserSelectSchema
};
