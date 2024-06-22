import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
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
    cell: ({ row }) => (
      <span className="flex gap-4 items-center">
        <DeleteEntity deleteRoute={services.user.getAll} />
        <Edit size={20} className="text-green-500" />
      </span>
    )
  }
];
