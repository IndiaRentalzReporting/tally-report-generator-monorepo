import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Button, Form, Skeleton } from '@trg_package/vite/components';
import {
  PermissionSelect,
  ModuleAction,
  ModulePermissions
} from '@trg_package/schemas-dashboard/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services as permissionService } from '@/services/Permissions';
import { services as actionService } from '@/services/Actions';
import { services as permission_actionService } from '@/services/Permission_Action';
import { createPermissionsUsingModulePermissions } from '@/utils/convertPermissionsUsingModulePermissions';
import Fields from './Fields';
import { FormState, SelectFormSchema } from './interface';

const Update: React.FC<Pick<PermissionSelect, 'id'>> = ({ id }) => {
  const form = useForm<FormState>({
    resolver: zodResolver(SelectFormSchema)
  });
  const [modulePermissions, setModulePermission] = React.useState<ModulePermissions>({});

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
  ): Array<ModuleAction & { permission_id: string }> => arr.map((pP) => {
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

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } = useMutation({
    mutationFn: async (values: FormState) => {
      const prettyPermissions: Array<
      ModuleAction & { permission_id: string }
      > = addPermissionId(
        createPermissionsUsingModulePermissions(modulePermissions)
      );

      for (const {
        module_id,
        action_ids,
        permission_id
      } of prettyPermissions) {
        await permissionService.deleteOne({ id: permission_id });
        const {
          data: { permission }
        } = await permissionService.createOne({
          module_id,
          role_id: values.role.id
        });
        for (const action_id of action_ids) {
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

  const handleSubmit = (values: FormState) => {
    createPermission(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <Skeleton isLoading={loadingPermissions}>
          <Fields
            modulePermissions={modulePermissions}
            setModulePermissions={setModulePermission}
            form={form}
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
    </Form>
  );
};

export default Update;
