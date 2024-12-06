import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { GeneratedReportColumns, GeneratedReportData, DetailedColumnSelect } from '@trg_package/schemas-reporting/types';
import { Button } from '@trg_package/vite/components';
import { Trash } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Action from '@/components/composite/dashboard/Action';
import { SortingButton } from '@/components/composite/SortingButton';
import { FormState } from './interface';
import { Column as IColumn } from '@/providers/ReportsProvider';
import Column from '@/components/composite/reports/UpdateColumn';

export const columns: ColumnDef<FormState>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortingButton column={column} label="Name" />,
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const report = row.original;
      return (
        <Link
          to={`/dashboard/Reports/${report.id}`}
          onClick={() => queryClient.removeQueries({ queryKey: ['Reports'], exact: false })}
        >
          <span className="flex gap-4 items-center">
            {report.name}
          </span>
        </Link>
      );
    }
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <SortingButton column={column} label="Description" />
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const report = row.original;
      return (
          <Action
            module={{
              id: report.id,
              name: report.name,
              deleteType: 'Reports',
              updateType: 'Reports'
            }}
          />
      );
    }
  }
];

export const createReadReportColumn = (column: GeneratedReportColumns)
: ColumnDef<GeneratedReportData> => ({
  id: column.alias,
  accessorKey: column.alias || 'No Name',
  header: ({ column: clmn }) => <SortingButton column={clmn} label={column.heading} />
});

export const createUpdateReportColumn = (
  column: IColumn,
  removeColumn: (id: string | undefined) => void
): ColumnDef<DetailedColumnSelect> => ({
  id: column.column.displayName,
  accessorKey: column.column.displayName || 'No Name',
  header: () => (
    <div className="flex items-center gap-4">
      <span className='w-max'>{column.column.displayName}</span>
      <Button
        className="flex items-center justify-center"
        variant="ghost"
        onClick={() => removeColumn(column.column.id)}
      >
        <Trash color="red" />
      </Button>
    </div>
  ),
  cell: () => <Column column={column} />,
});
