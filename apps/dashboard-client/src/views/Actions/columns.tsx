import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@trg_package/components';
import { DeleteEntity, UpdateEntity } from '@/components/composite';
import { services } from '@/services/action';
import { State } from './interface';

export const columns: ColumnDef<State>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="translate-x-[-10px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const action = row.original;
      return (
        <span className="flex gap-4 items-center">
          <DeleteEntity
            options={{
              mutation: {
                mutationFn: () => services.deleteOne(action.id)
              },
              name: action.name,
              module: 'Actions'
            }}
          />
          <UpdateEntity module="Actions" id={action.id} />
        </span>
      );
    }
  }
];
