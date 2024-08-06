import { Action, Module } from '@/models';
import { useAuth } from '@/providers/AuthProvider';

export const useIsAllowed = (data: {
  module: Module['name'];
  action: Action['name'];
}): boolean => {
  const { permissions } = useAuth();

  const isAllowed = permissions.find(
    (permission) =>
      permission.actions.includes(data.action) &&
      permission.module.name === data.module
  );

  if (isAllowed) return true;
  return false;
};
