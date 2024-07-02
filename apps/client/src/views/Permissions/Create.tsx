/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import services from '@/services';
import { Button } from '@/components/ui';
import { Action, Module } from '@/models';
import { ModulePermissions } from './interface';
import Fields from './Fields';

interface ModuleAction {
  module_id: Module['id'];
  action_ids: Action['id'][];
}

const Create: React.FC = () => {
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [modulePermissions, setModulePermission] =
    React.useState<ModulePermissions>({});

  useEffect(() => console.log({ selectedRole }), [selectedRole]);
  useEffect(() => console.log({ modulePermissions }), [modulePermissions]);

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
        queryClient.invalidateQueries({ queryKey: ['permissions', 'getAll'] });
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
        role={selectedRole}
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

export default Create;
