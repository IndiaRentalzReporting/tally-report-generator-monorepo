import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Module } from '@/models';
import {
  CardDescription,
  CardHeader,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Switch
} from '@/components/ui';
import { StateAsProps } from './interface';
import { DataTable } from '@/components/composite';
import services from '@/services';

interface ColumnData {
  module_name: Module['name'];
  module_id: Module['id'];
}

const Fields: React.FC<StateAsProps> = ({
  role,
  setRole,
  modulePermissions,
  setModulePermissions
}) => {
  const [columns, setColumns] = React.useState<ColumnDef<ColumnData>[]>([]);
  const [tableData, setTableData] = React.useState<Array<ColumnData>>([]);

  const { data: modules, isFetching: fetchingModules } = useQuery({
    queryFn: () => services.Modules.getAll(),
    select(data) {
      return data.data.modules;
    },
    queryKey: ['modules', 'getAll']
  });

  const { data: allRolesWithNoPermission, isFetching: fetchingRoles } =
    useQuery({
      queryFn: async () => services.Roles.getAll(),
      select: (data) =>
        data.data.roles.filter((r) =>
          !role ? r.permission.length === 0 : true
        ),
      queryKey: ['roles', 'getAll']
    });

  const { data: actions, isFetching: fetchingActions } = useQuery({
    queryFn: () => services.Actions.getAll(),
    select(data) {
      return data.data.actions;
    },
    queryKey: ['actions', 'getAll']
  });

  const handlePermissionChange = (
    checked: boolean,
    module_id: string,
    action_id: string
  ) => {
    setModulePermissions((prev) => ({
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
      id: 'Action',
      header: action.name.toUpperCase(),
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({
        row: {
          original: { module_id }
        }
      }) => {
        let isCheckedByDefault = false;
        const module = modulePermissions[module_id];
        if (module) {
          isCheckedByDefault = module[action.id] ?? false;
        }
        console.log({
          modulePermissions,
          isCheckedByDefault
        });
        return (
          <Switch
            checked={!!isCheckedByDefault}
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
  }, [actions, modulePermissions]);

  useEffect(() => {
    if (!modules) return;
    const columnData = modules.map(({ name: module_name, id: module_id }) => ({
      module_name,
      module_id
    }));

    setTableData(columnData);
  }, [modules]);

  return (
    <>
      <Select onValueChange={setRole} value={role} required>
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
    </>
  );
};

export default Fields;
