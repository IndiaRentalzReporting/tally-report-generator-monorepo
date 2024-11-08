import { ColumnDef } from '@tanstack/react-table';
import { Input, Label } from '@trg_package/vite/components';
import { UseFormReturn } from 'react-hook-form';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { FormState, InsertState, SelectState } from './interface';

export const columns = (form?: UseFormReturn<FormState>)
: ColumnDef<InsertState | SelectState>[] => ([
  {
    id: 'Role Name',
    accessorFn: (row) => row.role?.name,
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
    header: ({ column }) => <SortingButton column={column} label="Actions on Modules" />,
    cell: ({ row }) => {
      const { permissionAction } = row.original;
      const actions = permissionAction.map((p) => p.action);
      return (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <div key={action.id}>
              <Label>{action.name}</Label>
              <Input
                type='checkbox'
                disabled={!form}
                defaultChecked={action.checked}
                {...form?.register(`permissions.${row.index}.permissionAction.${index}.action.checked`)}
              />
            </div>
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
            id: permission.role?.id,
            name: permission.role?.name,
            type: 'Permissions'
          }}
        />
      );
    }
  }
]);
