import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DetailedUser } from '@/models';
import services from '@/services';
import { DeleteEntity, UpdateEntity } from '@/components/composite';
import { When } from '@/components/utility';
import { Button } from '@/components/ui';

export const columns: ColumnDef<DetailedUser>[] = [
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="translate-x-[-10px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="translate-x-[-10px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="translate-x-[-10px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'role.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="translate-x-[-10px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Roles
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <When condition={!!user.role_id}>
          <span className="border rounded-full py-2 px-4">
            {user.role?.name}
          </span>
        </When>
      );
    }
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <span className="flex gap-4 items-center">
          <DeleteEntity
            options={{
              mutation: {
                mutationFn: () => services.Users.deleteOne(user.id)
              },
              name: user.first_name,
              module: 'Users'
            }}
          />
          <UpdateEntity module="Users" id={user.id} />
        </span>
      );
    }
  }
];
