import {
  ActionSelect,
  ModuleSelect
} from '@trg_package/dashboard-schemas/types';
import { useAuth } from '@/providers/AuthProvider';

export const useIsAllowed = (data: {
  module: ModuleSelect['name'];
  action: ActionSelect['name'];
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
