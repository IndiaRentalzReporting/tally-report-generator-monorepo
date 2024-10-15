import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DetailedUser } from '@trg_package/schemas-dashboard/types';
import { Checkbox } from '@trg_package/vite/components';
import ActionCell from '@/components/composite/ActionCell';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<DetailedUser>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    header: ({ column }) =>
      useMemo(
        () => <SortingButton column={column} label="Module Name" />,
        [column]
      )
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) =>
      useMemo(
        () => <SortingButton column={column} label="Module Name" />,
        [column]
      )
  },
  {
    accessorKey: 'email',
    header: ({ column }) =>
      useMemo(
        () => <SortingButton column={column} label="Module Name" />,
        [column]
      )
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return useMemo(
        () => (
          <ActionCell
            module={{
              id: user.id,
              name: user.first_name,
              type: 'Users'
            }}
          />
        ),
        [user]
      );
    }
  }
];
