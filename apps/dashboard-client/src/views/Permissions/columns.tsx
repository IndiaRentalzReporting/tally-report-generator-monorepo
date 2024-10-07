import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { useMemo } from 'react';
import { State } from './interface';
import ActionCell from '@/components/composite/ActionCell';

export const columns: ColumnDef<State>[] = [
  {
    id: 'Role Name',
    accessorFn: (row) => row.role.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="translate-x-[-10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Role Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    getGroupingValue: (row) => `${row.role.name}}`
  },
  {
    id: 'Module Name',
    accessorFn: (row) => row.module.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="translate-x-[-10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Module Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  {
    id: 'Actions on Modules',
    accessorKey: 'permissionActions',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="translate-x-[-10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Actions
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
