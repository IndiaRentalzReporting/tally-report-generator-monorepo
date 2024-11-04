import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Button,
  Table as TB,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@trg_package/vite/components';
import { Trash } from 'lucide-react';

import { useCallback, useEffect, useState } from 'react';
import { DetailedColumnSelect } from '@trg_package/schemas-reporting/types';
import { Column, useReports } from '@/providers/ReportsProvider';
import UpdateColumn from './UpdateColumn';

interface TableProps<TData> {
  data: TData[];
}

const Table = <TData,>({ data }: TableProps<TData>) => {
  const {
    columns, removeColumn, updateReport, isUpdatingReport
  } = useReports();
  const [columnDef, setColumnDef] = useState<ColumnDef<TData>[]>([]);

  const createColumnDef = useCallback(
    (column: Column): ColumnDef<DetailedColumnSelect> => ({
      id: column.column.displayName,
      accessorKey: column.column.displayName || 'No Name',
      header: () => (
        <div className="flex items-center gap-4">
          <span>{column.column.displayName}</span>
          <Button
            className="flex items-center justify-center"
            variant="ghost"
            onClick={() => removeColumn(column.column.id)}
          >
            <Trash color="red" className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: () => <UpdateColumn column={column} />
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
        <TB>
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
        </TB>
      </div>
    </div>
  );
};

export default Table;
