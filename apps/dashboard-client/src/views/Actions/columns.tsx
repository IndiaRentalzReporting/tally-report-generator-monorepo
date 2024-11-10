import { ColumnDef } from '@tanstack/react-table';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { FormState } from './interface';

export const columns: ColumnDef<FormState>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortingButton column={column} label="Name" />
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const action = row.original;
      return (
        <Action
          module={{
            id: action.id,
            name: action.name,
            updateType: 'Actions',
            deleteType: 'Actions',
          }}
        />
      );
    }
  }
];
