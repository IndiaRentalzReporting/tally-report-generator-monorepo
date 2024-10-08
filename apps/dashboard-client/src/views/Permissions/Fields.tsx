import React, { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ModuleSelect } from '@trg_package/schemas-dashboard/types';
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
  Switch,
  DataTable
} from '@trg_package/vite/components';
import { StateAsProps } from './interface';
import { services as moduleService } from '@/services/module';
import { services as roleService } from '@/services/role';
import { services as actionService } from '@/services/action';

interface ColumnData {
  module_name: ModuleSelect['name'];
  module_id: ModuleSelect['id'];
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
    queryFn: () => moduleService.read(),
    select(data) {
      return data.data.modules;
    },
    queryKey: ['modules', 'getAll']
  });

  useEffect(() => {
    if (!modules) return;
    const columnData = modules.map(({ name: module_name, id: module_id }) => ({
      module_name,
      module_id
    }));

    setTableData(columnData);
  }, [modules]);

  const { data: allRolesWithNoPermission, isFetching: fetchingRoles } =
    useQuery({
      queryFn: async () => roleService.read(),
      select: (data) =>
        data.data.roles.filter((r) =>
          !role ? r.permission.length === 0 : true
        ),
      queryKey: ['roles', 'getAll']
    });

  const handlePermissionChange = useCallback(
    (checked: boolean, module_id: string, action_id: string) => {
      setModulePermissions((prev) => ({
        ...prev,
        [module_id]: {
          ...prev[module_id],
          [action_id]: checked
        }
      }));
    },
    [setModulePermissions]
  );

  const { data: actions, isFetching: fetchingActions } = useQuery({
    queryFn: () => actionService.read(),
    select(data) {
      return data.data.actions;
    },
    queryKey: ['actions', 'getAll']
  });

  useEffect(() => {
    if (!actions) return;
    const actionColumns = actions.map<ColumnDef<ColumnData>>((action) => ({
      id: `Action${action.id}`,
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
        header: 'ModuleSelect Name'
      },
      ...actionColumns
    ]);
  }, [actions, modulePermissions, handlePermissionChange]);

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
              {allRolesWithNoPermission?.map((rwnp) => (
                <SelectItem key={rwnp.id} value={rwnp.id}>
                  {rwnp.name}
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
