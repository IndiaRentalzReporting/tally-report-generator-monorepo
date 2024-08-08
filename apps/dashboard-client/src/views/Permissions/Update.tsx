import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { FormEventHandler, useEffect } from 'react';
import { services } from './services';
import { Button, Skeleton } from '@/components/ui';
import { Permission, ModuleAction, ModulePermissions } from '@/models';
import Fields from './Fields';
import { createPermissionsUsingModulePermissions } from '@/lib/utils/convertPermissionsUsingModulePermissions';

const Update: React.FC<Pick<Permission, 'id'>> = ({ id }) => {
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [modulePermissions, setModulePermission] =
    React.useState<ModulePermissions>({});

  const { data: permissions = [], isFetching: loadingPermissions } = useQuery({
    queryFn: () => services.getAllOfRole(id),
    select: (data) => data.data.permissions,
    queryKey: ['roles', 'getOne', id]
  });

  useEffect(() => {
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

  const addPermissionId = (
    arr: Array<ModuleAction>
  ): Array<ModuleAction & { permission_id: string }> => {
    return arr.map((pP) => {
      const permissionWithSameModuleId = permissions.find(
        (permission) => permission.module_id === pP.module_id
      );
      if (!permissionWithSameModuleId) {
        throw new Error();
      }
      return {
        ...pP,
        permission_id: permissionWithSameModuleId.id
      };
    });
  };

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } =
    useMutation({
      mutationFn: () => {
        const prettyPermissions: Array<
          ModuleAction & { permission_id: string }
        > = addPermissionId(
          createPermissionsUsingModulePermissions(modulePermissions)
        );

        return services.updateMany({
          role_id: selectedRole,
          permissions: prettyPermissions
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permission', 'getAll'] });
        queryClient.invalidateQueries({ queryKey: ['actions', 'getAll'] });
        setModulePermission({});
      }
    });

  const handleUpdatePermission: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createPermission();
  };

  return (
    <form onSubmit={handleUpdatePermission} className="flex flex-col gap-4">
      <Skeleton isLoading={loadingPermissions}>
        <Fields
          modulePermissions={modulePermissions}
          setModulePermissions={setModulePermission}
          role={id}
          setRole={setSelectedRole}
        />
      </Skeleton>
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
