/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { table } from 'console';
import services from '@/services';
import {
  CardHeader,
  Button,
  Switch,
  Skeleton,
  CardDescription,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import { DataTable } from '@/components/composite/table/data-table';
import { Action, Module } from '@/models';

interface ColumnData {
  module_name: Module['name'];
  module_id: Module['id'];
}

interface ModuleAction {
  module_id: Module['id'];
  action_ids: Action['id'][];
}

const Create: React.FC = () => {
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [columns, setColumns] = React.useState<ColumnDef<ColumnData>[]>([]);
  const [tableData, setTableData] = React.useState<Array<any>>([]);
  const [modulePermissions, setModulePermission] = React.useState<{
    [module_id: string]: {
      [action_id: string]: boolean;
    };
  }>({});

  const { data: modules, isFetching: fetchingModules } = useQuery({
    queryFn: () => services.Modules.getAll(),
    select(data) {
      return data.data.modules;
    },
    queryKey: ['modules', 'getAll']
  });

  const { data: actions, isFetching: fetchingActions } = useQuery({
    queryFn: () => services.Actions.getAll(),
    select(data) {
      return data.data.actions;
    },
    queryKey: ['actions', 'getAll']
  });

  const { data: allRolesWithNoPermission, isFetching: fetchingRoles } =
    useQuery({
      queryFn: async () => services.Roles.getAll(),
      select: (data) =>
        data.data.roles.filter((role) => role.permission.length === 0),
      queryKey: ['roles', 'getAll']
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
      }) => (
        <Switch
          onCheckedChange={(checked) =>
            handlePermissionChange(checked, module_id, action.id)
          }
        />
      )
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

    setTableData(columnData);
  }, [modules]);

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
        queryClient.invalidateQueries({ queryKey: ['permission', 'getAll'] });
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
      <Select onValueChange={setSelectedRole} required>
        <SelectTrigger>
          <SelectValue placeholder="Select a Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Roles</SelectLabel>
            <Skeleton isLoading={fetchingRoles}>
              {allRolesWithNoPermission?.map((role, index) => (
                <SelectItem key={index} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </Skeleton>
          </SelectGroup>
        </SelectContent>
      </Select>
      <CardHeader className="px-0 py-2">
        <CardDescription>Assign permissions to your permission</CardDescription>
      </CardHeader>
      <Skeleton
        isLoading={fetchingActions || fetchingModules}
        className="w-full h-20"
      >
        <DataTable columns={columns} data={tableData} />
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

export default Create;
