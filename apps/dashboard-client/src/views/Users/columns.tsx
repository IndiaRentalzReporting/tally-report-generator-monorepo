import { ColumnDef } from '@tanstack/react-table';
import { DetailedUser } from '@trg_package/schemas-dashboard/types';
import { Checkbox } from '@trg_package/vite/components';
import Action from '@/components/composite/dashboard/Action';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<DetailedUser>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => <SortingButton column={column} label="Module Name" />
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => <SortingButton column={column} label="Module Name" />
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortingButton column={column} label="Module Name" />
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
            type: 'Users'
          }}
        />
      );
    }
  }
];
