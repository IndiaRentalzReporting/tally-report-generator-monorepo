import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  When
} from '@trg_package/vite/components';
import { DetailedColumnSelect } from '@trg_package/schemas-reporting/types';
import { Trash } from 'lucide-react';

import { useCallback, useEffect, memo, useState } from 'react';
import { Column, useReports } from '@/providers/ReportsProvider';
import { UpdateColumn } from './UpdateColumn';
import ReportSettings from './Settings';

interface DataTableProps<TData> {
  data: TData[];
}

const DataTable = <TData,>({ data }: DataTableProps<TData>) => {
  const { columns, removeColumn } = useReports();
  const [columnDef, setColumnDef] = useState<ColumnDef<TData>[]>([]);

  const createColumnDef = useCallback(
    (column: Column): ColumnDef<DetailedColumnSelect> => ({
      id: column.column.name,
      accessorKey: column.column.name,
      header: () => (
        <MemoizedHeaderButton column={column} removeColumn={removeColumn} />
      ),
      cell: () => <MemoizedUpdateButton columnName={column.column.name} />
    }),
    [removeColumn]
  );

  useEffect(() => {
    if (columns) {
      const newColumnDefs = columns.map(createColumnDef);
      setColumnDef(newColumnDefs as ColumnDef<TData>[]);
    }
  }, [columns, createColumnDef]);

  const table = useReactTable({
    data,
    columns: columnDef,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md border w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length && columns.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When condition={!!columns.length}>
        <ReportSettings />
      </When>
    </div>
  );
};

// Memoized components for header and update buttons
const HeaderButton: React.FC<{
  column: Column;
  removeColumn: (entity: Column) => void;
}> = ({ column, removeColumn }) => (
  <div className="flex items-center gap-4">
    <span>{column.column.name}</span>
    <Button
      className="flex items-center justify-center"
      variant="ghost"
      onClick={() => removeColumn(column)}
    >
      <Trash color="red" className="h-4 w-4" />
    </Button>
  </div>
);

const MemoizedHeaderButton = memo(HeaderButton);

const UpdateButton: React.FC<{ columnName: string }> = ({ columnName }) => (
  <div className="flex items-center justify-center h-[30vh] hover:bg-muted/50 rounded-md">
    <UpdateColumn columnName={columnName} />
  </div>
);

const MemoizedUpdateButton = memo(UpdateButton);

export default DataTable;
