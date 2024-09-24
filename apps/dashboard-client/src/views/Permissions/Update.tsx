import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { FormEventHandler, useEffect } from 'react';
import { services as permissionService } from '@/services/permission';
import { services as actionService } from '@/services/action';
import { services as permission_actionService } from '@/services/permission_action';
import { Button, Skeleton } from '@trg_package/components';
import {
  PermissionSelect,
  ModuleAction,
  ModulePermissions
} from '@trg_package/schemas-dashboard/types';
import Fields from './Fields';
import { createPermissionsUsingModulePermissions } from '@/utils/convertPermissionsUsingModulePermissions';

const Update: React.FC<Pick<PermissionSelect, 'id'>> = ({ id }) => {
  const [selectedRole, setSelectedRole] = React.useState<string>(id);
  const [modulePermissions, setModulePermission] =
    React.useState<ModulePermissions>({});

  const { data: permissions = [], isFetching: loadingPermissions } = useQuery({
    queryFn: () => permissionService.read({ role_id: id }),
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
      mutationFn: async () => {
        const prettyPermissions: Array<
          ModuleAction & { permission_id: string }
        > = addPermissionId(
          createPermissionsUsingModulePermissions(modulePermissions)
        );

        for (let {
          module_id,
          action_ids,
          permission_id
        } of prettyPermissions) {
          await permissionService.deleteOne(permission_id);
          const {
            data: { permission }
          } = await permissionService.createOne({
            module_id,
            role_id: selectedRole
          });
          for (let action_id of action_ids) {
            await actionService.read({ id: action_id });
            await permission_actionService.createOne({
              permission_id: permission.id,
              action_id
            });
          }
        }
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
        Create PermissionSelect
      </Button>
    </form>
  );
};

export default Update;
