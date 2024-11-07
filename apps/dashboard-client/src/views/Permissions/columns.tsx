import { ColumnDef } from '@tanstack/react-table';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { InsertState, SelectState } from './interface';

export const columns: ColumnDef<InsertState | SelectState>[] = [
  {
    id: 'Role Name',
    accessorFn: (row) => row.role.name,
    header: ({ column }) => <SortingButton column={column} label="Role Name" />,
    getGroupingValue: (row) => `${row.role?.name}}`
  },
  {
    id: 'Module Name',
    accessorFn: (row) => row.module.name,
    header: ({ column }) => <SortingButton column={column} label="Module Name" />,
  },
  {
    id: 'Actions on Modules',
    accessorKey: 'permissionActions',
    header: ({ column }) => <SortingButton column={column} label="Actions" />,
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
      return (
        <Action
          module={{
            id: permission.role.id,
            name: permission.role.name,
            type: 'Permissions'
          }}
        />
      );
    }
  }
];
