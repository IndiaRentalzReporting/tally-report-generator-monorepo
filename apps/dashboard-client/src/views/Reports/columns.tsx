import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { State } from './interface';
import ActionCell from '@/components/composite/ActionCell';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<State>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) =>
      useMemo(
        () => <SortingButton column={column} label="Module Name" />,
        [column]
      )
  },
  {
    accessorKey: 'description',
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
      const report = row.original;
      return useMemo(
        () => (
          <ActionCell
            module={{
              id: report.id,
              name: report.name,
              type: 'Reports'
            }}
          />
        ),
        [report]
      );
    }
  }
];
