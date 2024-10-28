import { useQueryClient, useMutation } from '@tanstack/react-query';
import React, { FormEventHandler } from 'react';
import { Button } from '@trg_package/vite/components';
import { ModulePermissions } from '@trg_package/schemas-dashboard/types';
import { services } from '@/services/permission';
import { services as actionService } from '@/services/action';
import { services as permission_actionService } from '@/services/permission_action';
import Fields from './Fields';
import { createPermissionsUsingModulePermissions } from '@/utils/convertPermissionsUsingModulePermissions';

const Create: React.FC = () => {
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [modulePermissions, setModulePermission] = React.useState<ModulePermissions>({});

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } = useMutation({
    mutationFn: async () => {
      const permissions = createPermissionsUsingModulePermissions(modulePermissions);
      for (const { module_id, action_ids } of permissions) {
        const {
          data: {
            permission: { id: permission_id }
          }
        } = await services.createOne({
          module_id,
          role_id: selectedRole
        });
        for (const action_id of action_ids) {
          await actionService.read({ id: action_id });
          await permission_actionService.createOne({
            permission_id,
            action_id
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['roles', 'getAll'] });
      setModulePermission({});
      setSelectedRole('');
    }
  });

  const handleCreatePermission: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createPermission();
  };

  return (
    <form onSubmit={handleCreatePermission} className="flex flex-col gap-4">
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
