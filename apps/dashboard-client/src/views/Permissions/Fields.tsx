import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DataTable,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import { useFieldArray } from 'react-hook-form';
import { services as roleService } from '@/services/Roles';
import { services as moduleService } from '@/services/Modules';
import { services as actionService } from '@/services/Actions';
import { StateAsProps } from './interface';
import { columns } from './columns';
import { SortingButton } from '@/components/composite';

const Fields: React.FC<StateAsProps> = ({
  form
}) => {
  const { fields, append, replace } = useFieldArray({
    control: form.control,
    name: 'permissions'
  });

  const { data: roles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: async () => roleService.read(),
    select: (data) => data.data.roles.filter((role) => !role.permission.length),
    queryKey: ['Roles', 'getAll']
  });

  const { data: actions = [], isFetching: fetchingActions } = useQuery({
    queryFn: () => actionService.read(),
    select: (data) => data.data.actions,
    queryKey: ['Actions', 'getAll']
  });

  const { data: modules = [], isFetching: fetchingModules } = useQuery({
    queryFn: () => moduleService.read(),
    select: (data) => data.data.modules,
    queryKey: ['Modules', 'getAll']
  });

  useEffect(() => {
    if (modules && !form.getValues('permissions').length) {
      replace([]);
      modules.map((module) => append({
        module: {
          id: module.id,
          name: module.name
        },
        role: form.getValues('permissions')[0]?.role ?? { name: 'No name role', id: 'No id role' },
        permissionAction: actions.map(({ id, name }) => ({
          action: {
            id, name, checked: false
          }
        }))
      }));
    }
  }, [modules, actions, append, replace]);

  const handleRoleChange = (newRoleId: string) => {
    const values = form.getValues('permissions').map((permission) => ({
      ...permission,
      role: { id: newRoleId, name: roles.find((role) => role.id === newRoleId)?.name ?? 'No name role' }
    }));
    form.setValue(
      'permissions',
      values
    );
  };

  return (
    <div>
      <FormField
        control={form.control}
        name="permissions.0.role.id"
        render={({ field }) => (
          <FormItem className='flex-grow'>
            <FormLabel>Base Entity</FormLabel>
            <FormControl>
              <Select
                {...field}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <Skeleton isLoading={fetchingRoles}>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </Skeleton>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <Skeleton isLoading={fetchingActions || fetchingModules }>
        <DataTable
          columns={[...columns
            .filter((column) => column.id !== 'Role Name')
            .filter((column) => column.id !== 'Actions on Modules'), {
            id: 'Actions on Modules',
            accessorKey: 'permissionActions',
            header: ({ column }) => <SortingButton column={column} label="Actions" />,
            cell: ({ row }) => {
              const { permissionAction } = row.original;
              const permissionActions = permissionAction.map((p) => p.action.name);
              return (
                <div className="flex items-center gap-2">
                  {permissionActions.map((action, index) => (
                    <div>
                      <Label>{action}</Label>
                      <Input type='checkbox' {...form.register(`permissions.${row.index}.permissionAction.${index}.action.checked`)} />
                    </div>
                  ))}
                </div>
              );
            }
          }
          ]}
          data={fields}
          grouping={{
            rowGrouping: [],
            setRowGrouping: () => null
          }}
          selection={{
            rowSelection: {},
            setRowSelection: () => null
          }}
        />
      </Skeleton>
    </div>
  );
};

export default Fields;
