import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { State } from './interface';
import ActionCell from '@/components/composite/ActionCell';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<State>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) =>
      useMemo(() => <SortingButton column={column} label="Name" />, [column])
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const role = row.original;
      return useMemo(
        () => (
          <ActionCell
            module={{
              id: role.id,
              name: role.name,
              type: 'Roles'
            }}
          />
        ),
        [role]
      );
    }
  }
];
