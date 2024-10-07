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
      const action = row.original;
      return useMemo(
        () => (
          <ActionCell
            module={{
              id: action.id,
              name: action.name,
              type: 'Actions'
            }}
          />
        ),
        [action]
      );
    }
  }
];
