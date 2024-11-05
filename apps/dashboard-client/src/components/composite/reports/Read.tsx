import React, { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef, flexRender, getCoreRowModel, useReactTable
} from '@tanstack/react-table';
import { GeneratedReportColumns, GeneratedReportData } from '@trg_package/schemas-reporting/types';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';

const Read: React.FC = () => {
  const {
    reportData,
    reportColumns
  } = useReports();

  if (!reportColumns || !reportData) throw new Error('');

  const [columnDef, setColumnDef] = useState<Array<ColumnDef<GeneratedReportData>>>([]);

  const createColumnDef = useMemo(() => (column: GeneratedReportColumns): ColumnDef<
  GeneratedReportData
  > => ({
    id: column.alias,
    accessorKey: column.alias || 'No Name',
    header: () => (
          <div className="flex items-center gap-4">
            <span>{column.heading}</span>
          </div>
    )
  }
  ), []);

  useEffect(() => {
    if (reportColumns) {
      const newColumnDefs = reportColumns.map(createColumnDef);
      setColumnDef(newColumnDefs);
    }
  }, [reportColumns, createColumnDef]);

  const table = useReactTable({
    data: reportData,
    columns: columnDef,
    getCoreRowModel: getCoreRowModel()
  });

  return (
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
          {table.getRowModel().rows?.length && reportColumns.length ? (
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
                colSpan={reportColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Read;
