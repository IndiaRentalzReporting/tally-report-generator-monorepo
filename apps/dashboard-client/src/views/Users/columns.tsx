import { ColumnDef } from '@tanstack/react-table';
import {
  Badge
} from '@trg_package/vite/components';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { FormState } from './interface';

export const columns: ColumnDef<FormState>[] = [
  {
    accessorKey: 'first_name',
    header: ({ column }) => <SortingButton column={column} label="First Name" />
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => <SortingButton column={column} label="Last Name" />
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortingButton column={column} label="Email" />
  },
  {
    accessorKey: 'role.name',
    header: ({ column }) => <SortingButton column={column} label="Role" />,
    cell: ({ row }) => {
      const { role } = row.original;
      return (
        role
          && <Badge>{role.name}</Badge>
      );
    }
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Action
          module={{
            id: user.id,
            name: user.first_name,
            deleteType: 'Users',
            updateType: 'Users'
          }}
        />
      );
    }
  }
];
