import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { DetailedUser } from '@/models';
import DeleteEntity from '@/components/composite/DeleteEntity';
import services from '@/services';

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
      const queryClient = useQueryClient();
      return (
        <span className="flex gap-4 items-center">
          <DeleteEntity
            options={{
              mutation: {
                mutationFn: () => services.module.deleteOne(user.id),
                onSuccess: () =>
                  queryClient.invalidateQueries({
                    queryKey: ['users', 'getAll']
                  })
              },
              name: user.first_name,
              module: 'User'
            }}
          />
          <Edit size={20} className="text-green-500" />
        </span>
      );
    }
  }
];
