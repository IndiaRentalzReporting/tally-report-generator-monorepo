/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import services from '@/services';
import { Button } from '@/components/ui';
import { Action, Module, Permission } from '@/models';
import Fields from './Fields';
import { ModulePermissions } from './interface';

interface ModuleAction {
  module_id: Module['id'];
  action_ids: Action['id'][];
}

const Update: React.FC<Pick<Permission, 'id'>> = ({ id }) => {
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [modulePermissions, setModulePermission] =
    React.useState<ModulePermissions>({});

  const { data: permissions, isFetching: loadingPermissions } = useQuery({
    queryFn: () => services.Permissions.getAllOfRole(id),
    select: (data) => data.data.permissions,
    queryKey: ['roles', 'getOne', id]
  });

  useEffect(() => {
    if (!permissions) return;
    const result: ModulePermissions = {};

    permissions.forEach((item) => {
      const moduleId = item.module_id;
      if (!result[moduleId]) {
        result[moduleId] = {};
      }

      item.permissionAction.forEach((permission) => {
        const actionId = permission.action.id;
        const module = result[moduleId];
        if (!module) return;
        module[actionId] = true;
      });
    });

    setModulePermission(result);
  }, [permissions]);

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } =
    useMutation({
      mutationFn: () => {
        const permissions: Array<ModuleAction> = [];
        for (const module_id in modulePermissions) {
          const module = modulePermissions[module_id];
          const p: ModuleAction = {
            module_id,
            action_ids: []
          };
          if (module)
            for (const action_id in module)
              if (module[action_id]) p.action_ids.push(action_id);
          permissions.push(p);
        }
        return services.Permissions.createOne({
          role_id: selectedRole,
          permissions
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permission', 'getAll'] });
        queryClient.invalidateQueries({ queryKey: ['actions', 'getAll'] });
        setModulePermission({});
      }
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPermission();
      }}
      className="flex flex-col gap-4"
    >
      <Fields
        modulePermissions={modulePermissions}
        setModulePermissions={setModulePermission}
        role={id}
        setRole={setSelectedRole}
      />
      <Button
        type="submit"
        className="w-min mt-2"
        isLoading={createPermissionLoading}
      >
        Create Permission
      </Button>
    </form>
  );
};

export default Update;
