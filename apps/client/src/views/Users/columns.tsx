import { ColumnDef } from '@tanstack/react-table';
import { DetailedUser } from '@/models';
import services from '@/services';
import { DeleteEntity, UpdateEntity } from '@/components/composite';

export const columns: ColumnDef<DetailedUser>[] = [
  {
    id: 'Sr. No.',
    header: 'Sr. No.',
    cell: ({ row }) => <span>{row.index + 1}</span>
  },
  {
    accessorKey: 'first_name',
    header: 'First Name'
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role.name',
    header: 'Roles'
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
