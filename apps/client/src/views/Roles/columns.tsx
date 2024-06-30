import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { DeleteEntity, UpdateEntity } from '@/components/composite';
import services from '@/services';
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
      const role = row.original;
      return (
        <span className="flex gap-4 items-center">
          <DeleteEntity
            options={{
              mutation: {
                mutationFn: () => services.Roles.deleteOne(role.id)
              },
              name: role.name,
              module: 'Roles'
            }}
          />
          <UpdateEntity module="Roles" id={role.id} />
        </span>
      );
    }
  }
];
