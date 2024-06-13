/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import services from '@/services';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Switch,
  Skeleton,
  CardDescription
} from '@/components/ui';
import { DataTable } from '@/components/composite/table/data-table';
import { If, Then, Else } from '@/components/utility';

interface ColumnData {
  module_name: string;
  module_id: string;
}

const CreateRole: React.FC = () => {
  const [roleName, setRoleName] = React.useState<string>('');
  const [columns, setColumns] = React.useState<ColumnDef<ColumnData>[]>([]);
  const [data, setData] = React.useState<Array<any>>([]);
  const [modulePermissions, setModulePermission] = React.useState<{
    [module_id: string]: {
      [action_id: string]: boolean;
    };
  }>({});

  const { data: modules, isFetching: fetchingModules } = useQuery({
    queryFn: () => services.module.getAll(),
    select(data) {
      return data.data.modules;
    },
    queryKey: ['modules', 'getAll'],
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const { data: actions, isFetching: fetchingActions } = useQuery({
    queryFn: () => services.action.getAll(),
    select(data) {
      return data.data.actions;
    },
    queryKey: ['actions', 'getAll'],
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const handlePermissionChange = (
    checked: boolean,
    module_id: string,
    action_id: string
  ) => {
    setModulePermission((prev) => ({
      ...prev,
      [module_id]: {
        ...prev[module_id],
        [action_id]: checked
      }
    }));
  };

  useEffect(() => {
    if (!actions) return;
    const actionColumns = actions.map<ColumnDef<ColumnData>>((action) => ({
      header: action.name.toUpperCase(),
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({
        row: {
          original: { module_id }
        }
      }) => {
        return (
          <Switch
            onCheckedChange={(checked) =>
              handlePermissionChange(checked, module_id, action.id)
            }
          />
        );
      }
    }));
    setColumns([
      {
        accessorKey: 'module_name',
        header: 'Module Name'
      },
      ...actionColumns
    ]);
  }, [actions]);

  useEffect(() => {
    if (!modules) return;
    const columnData = modules.map(({ name: module_name, id: module_id }) => ({
      module_name,
      module_id
    }));

    setData(columnData);
  }, [modules]);

  const queryClient = useQueryClient();
  const { mutateAsync: createRole } = useMutation({
    mutationFn: () => {
      const permissions = [];
      for (const module_id in modulePermissions) {
        const module = modulePermissions[module_id];
        if (module) {
          for (const action_id in module) {
            if (module[action_id]) {
              permissions.push({
                module_id,
                action_id
              });
            }
          }
        }
      }
      return services.role.createOne({
        roleName,
        rolePermissions: permissions
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['role', 'getAll'] });
      setModulePermission({});
      setRoleName('');
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Role</CardTitle>
        <CardDescription>
          Create roles for Role Based Access Control
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          required
          minLength={3}
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <CardHeader className="px-0 py-2">
          <CardDescription>Assign permissions to your role</CardDescription>
        </CardHeader>
        <If condition={fetchingActions && fetchingModules}>
          <Then>
            <Skeleton className="w-full h-20" />
          </Then>
          <Else>
            <DataTable columns={columns} data={data} />
          </Else>
        </If>
        <Button
          className="mt-8 w-min"
          type="submit"
          onClick={() => createRole()}
        >
          Create Role
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateRole;
