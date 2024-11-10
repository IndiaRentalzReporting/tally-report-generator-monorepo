/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React from 'react';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import {
  PermissionSelect
} from '@trg_package/schemas-dashboard/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { services as permissionService } from '@/services/Permissions';
import { services as moduleService } from '@/services/Modules';
import { services as actionService } from '@/services/Actions';
import { services as permission_actionService } from '@/services/Permission_Action';
import {
  ActionSchema, FormState, ModuleSchema, SelectFormSchema
} from './interface';
import Fields from './Fields';

const Update: React.FC<Pick<PermissionSelect, 'id'>> = ({ id }) => {
  const { data: modules = [] } = useQuery({
    queryFn: () => moduleService.read(),
    select: (data) => data.data.modules.map((module) => ModuleSchema.parse(module)),
    queryKey: ['Modules', 'getAll']
  });

  const { data: actions = [] } = useQuery({
    queryFn: () => actionService.read(),
    select: (data) => data.data.actions.map((action) => ActionSchema.parse(action)),
    queryKey: ['Actions', 'getAll']
  });

  const { data: permissions = [], isFetching: loadingPermissions } = useQuery({
    queryFn: () => permissionService.read({ role_id: id }),
    select: (data) => {
      const existingPermissions = data.data.permissions.map((permission) => SelectFormSchema.parse({
        ...permission,
        permissionId: permission.id,
        permissionAction: actions.map((action) => ({
          action: {
            ...action,
            checked: permission.permissionAction.some((pa) => pa.action.id === action.id),
          },
        })),
      }));

      const existingModuleIds = new Set(existingPermissions.map((p) => p.module.id));
      const missingModules = modules.filter((module) => !existingModuleIds.has(module.id));

      const missingPermissions = missingModules.map((module) => ({
        module,
        role: { id, name: 'Name not available' },
        permissionAction: actions.map((action) => ({
          action: { ...action, checked: false },
        })),
      }));

      return [...existingPermissions, ...missingPermissions];
    },
    queryKey: ['Permissions', 'getOne', id],
    enabled: !!actions
  });

  const form = useForm<FormState>({
    resolver: zodResolver(z.object({ permissions: z.array(SelectFormSchema) })),
    values: {
      permissions
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'permissions'
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } = useMutation({
    mutationFn: async (permissionsSubmit: FormState['permissions']) => {
      const checkedPermissions = permissionsSubmit.map((permission) => SelectFormSchema.parse({
        ...permission,
        permissionAction: permission.permissionAction.filter((pa) => pa.action.checked)
      }));
      for (const {
        module, role, permissionAction, permissionId
      } of checkedPermissions) {
        if (permissionId) {
          await permissionService.deleteOne({ id: permissionId });
        }
        if (permissionAction.length) {
          const { data: { permission: { id: permission_id } } } = await permissionService
            .createOne({
              module_id: module.id,
              role_id: role.id
            });
          for (const { action } of permissionAction) {
            await actionService.read({
              id: action.id
            });
            await permission_actionService.createOne({
              permission_id,
              action_id: action.id
            });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Permissions', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['Permissions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getAll'] });
    }
  });

  const handleSubmit = (values: FormState) => {
    createPermission(values.permissions);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="permissions.0.role.id"
          render={({ field }) => (
            <FormItem className='flex-grow'>
              <FormLabel>Base Entity</FormLabel>
              <FormControl>
                <Skeleton isLoading={loadingPermissions}>
                  <Select
                    {...field}
                    disabled
                    defaultValue={id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={id}>
                          {permissions[0]?.role.name}
                        </SelectItem>
                    </SelectContent>
                  </Select>
                </Skeleton>
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Skeleton isLoading={loadingPermissions}>
          <Fields
            form={form}
            fields={fields}
          />
          <Button
            type="submit"
            className="w-min mt-2"
            isLoading={createPermissionLoading}
          >
            Update Permission
          </Button>
        </Skeleton>
      </form>
    </Form>
  );
};

export default Update;
