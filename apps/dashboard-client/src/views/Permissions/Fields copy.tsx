/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  CardDescription,
  CardHeader,
  DataTable,
  Input,
  Label
} from '@trg_package/vite/components';
import { useFieldArray, useForm } from 'react-hook-form';
import { services as moduleService } from '@/services/Modules';
import { services as actionService } from '@/services/Actions';
import { FormState as FS } from './interface';
import { columns } from './columns';
import { SortingButton } from '@/components/composite';

type FormState = {
  permissions: Array<FS>;
};

const Fields: React.FC = () => {
  const form = useForm<FormState>({
    defaultValues: {
      permissions: []
    }
  });
  const { fields, append, replace } = useFieldArray({
    control: form.control,
    name: 'permissions'
  });

  const { data: actions = [], isFetching: fetchingActions } = useQuery({
    queryFn: () => actionService.read(),
    select(data) {
      return data.data.actions;
    },
    queryKey: ['Actions', 'getAll']
  });

  const { data: modules = [], isFetching: fetchingModules } = useQuery({
    queryFn: () => moduleService.read(),
    select(data) {
      return data.data.modules;
    },
    queryKey: ['Modules', 'getAll']
  });

  useEffect(() => {
    if (modules && !fetchingModules) {
      replace([]);
      modules.map((module) => {
        append({
          module: {
            id: module.id,
            name: module.name
          },
          role: form.getValues('permissions')[0]?.role ?? { name: 'Role 1', id: '132' },
          permissionAction: actions.map(({ id, name }) => ({
            action: {
              id, name, checked: false, static: false
            }
          }))
        });
      });
    }
  }, [modules, fetchingModules]);

  const handleSubmit = (values: FormState) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <CardHeader className="px-0 py-2">
        <CardDescription>Assign permissions to your permission</CardDescription>
      </CardHeader>
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
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default Fields;
