import { Action, Modules } from '@/models';
import { useAuth } from '@/providers/AuthProvider';

const useIsAllowed = (data: {
  module: Modules;
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

export default useIsAllowed;
