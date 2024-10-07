import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { State } from './interface';
import ActionCell from '@/components/composite/ActionCell';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<State>[] = [
  {
    id: 'Role Name',
    accessorFn: (row) => row.role.name,
    header: ({ column }) =>
      useMemo(() => <SortingButton column={column} label="Name" />, [column]),
    getGroupingValue: (row) => `${row.role.name}}`
  },
  {
    id: 'Module Name',
    accessorFn: (row) => row.module.name,
    header: ({ column }) =>
      useMemo(
        () => <SortingButton column={column} label="Module Name" />,
        [column]
      )
  },
  {
    id: 'Actions on Modules',
    accessorKey: 'permissionActions',
    header: ({ column }) =>
      useMemo(
        () => <SortingButton column={column} label="Actions" />,
        [column]
      ),
    cell: ({ row }) => {
      const { permissionAction } = row.original;
      const actions = permissionAction.map((p) => p.action.name);
      return (
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <span className="border rounded-full py-2 px-4" key={action}>
              {action}
            </span>
          ))}
        </div>
      );
    }
  },
  {
    id: 'Permission Actions',
    accessorKey: 'Actions',
    header: 'Actions',
    aggregatedCell: ({ row }) => {
      const permission = row.original;
      return useMemo(
        () => (
          <ActionCell
            module={{
              id: permission.id,
              name: permission.id,
              type: 'Permissions'
            }}
          />
        ),
        [permission]
      );
    }
  }
];
