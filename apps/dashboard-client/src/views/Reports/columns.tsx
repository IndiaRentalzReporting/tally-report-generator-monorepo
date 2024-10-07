import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { useMemo } from 'react';
import { State } from './interface';
import ActionCell from '@/components/composite/ActionCell';

export const columns: ColumnDef<State>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="translate-x-[-10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description'
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
