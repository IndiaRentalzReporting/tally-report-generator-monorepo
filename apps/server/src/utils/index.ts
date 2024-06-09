import { UserSelect, UserWithRole, UserWithRolePretty } from '../models/schema';

export const formatUserObject = (user: UserWithRole): UserWithRolePretty => {
  const roles = user.userToRole.map(({ role }) => ({
    name: role.name,
    id: role.id
  }));
  const { userToRole, ...rest } = user;
  return {
    ...rest,
    roles
  };
};
