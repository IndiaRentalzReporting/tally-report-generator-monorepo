import { ColumnDef } from '@tanstack/react-table';
import {
  Badge
} from '@trg_package/vite/components';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { FormState, SelectFormSchema } from './interface';

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
    accessorKey: 'role.name',
    header: ({ column }) => <SortingButton column={column} label="Role" />,
    cell: ({ row }) => {
      const user = row.original;
      const safeUser = SelectFormSchema.safeParse(user);
      return (
        safeUser.success && safeUser.data.role
          ? <Badge>{safeUser.data.role.name}</Badge>
          : null
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
