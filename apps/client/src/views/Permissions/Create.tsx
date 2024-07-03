/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useQueryClient, useMutation } from '@tanstack/react-query';
import React, { FormEventHandler } from 'react';
import services from '@/services';
import { Button } from '@/components/ui';
import { ModulePermissions } from './interface';
import Fields from './Fields';
import { createPermissionsUsingModulePermissions } from '@/lib/utils/convertPermissionsUsingModulePermissions';

const Create: React.FC = () => {
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [modulePermissions, setModulePermission] =
    React.useState<ModulePermissions>({});

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } =
    useMutation({
      mutationFn: () => {
        const permissions =
          createPermissionsUsingModulePermissions(modulePermissions);
        return services.Permissions.createMany({
          role_id: selectedRole,
          permissions
        });
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
