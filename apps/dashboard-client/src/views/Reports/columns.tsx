import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
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
      ),
    cell: ({ row }) => {
      const report = row.original;
      return useMemo(
        () => (
          <span className="flex gap-4 items-center">
            {report.name}
            <Link to={`/reports/${report.id}`}>
              <ExternalLink size={20} />
            </Link>
          </span>
        ),
        [report]
      );
    }
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
