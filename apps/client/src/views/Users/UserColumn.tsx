import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import {
  Select,
  Checkbox,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import { DetailedUser } from '@/models';
import DeleteEntity from '@/components/composite/DeleteEntity';
import services from '@/services';

export const columns: ColumnDef<DetailedUser>[] = [
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
