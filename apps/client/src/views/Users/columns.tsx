import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { DetailedUser } from '@/models';
import DeleteEntity from '@/components/composite/DeleteEntity';
import services from '@/services';
import { When } from '@/components/utility';
import useIsAllowed from '@/lib/hooks/useIsAllowed';

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
      const isEditAllowed = useIsAllowed({
        module: 'Users',
        action: 'Update'
      });
      const isDeleteAllowed = useIsAllowed({
        module: 'Users',
        action: 'Delete'
      });
      return (
        <span className="flex gap-4 items-center">
          <When condition={!!isDeleteAllowed}>
            <DeleteEntity
              options={{
                mutation: {
                  mutationFn: () => services.Users.deleteOne(user.id),
                  onSuccess: () =>
                    queryClient.invalidateQueries({
                      queryKey: ['users', 'getAll']
                    })
                },
                name: user.first_name,
                module: 'User'
              }}
            />
          </When>
          <When condition={!!isEditAllowed}>
            <Link to={`/dashboard/Users/Update/${user.id}`}>
              <Edit size={20} className="text-green-500" />
            </Link>
          </When>
        </span>
      );
    }
  }
];
