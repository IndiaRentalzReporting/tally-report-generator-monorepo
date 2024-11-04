import { ColumnDef } from '@tanstack/react-table';
import { FormState } from './interface';
import Action from '@/components/composite/dashboard/Action';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<FormState>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortingButton column={column} label="Name" />
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const role = row.original;
      return (
          <Action
            module={{
              id: role.id,
              name: role.name,
              type: 'Roles'
            }}
          />
      );
    }
  }
];
