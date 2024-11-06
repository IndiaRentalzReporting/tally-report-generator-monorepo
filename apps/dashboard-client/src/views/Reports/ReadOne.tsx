import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { GeneratedReportData, GeneratedReportColumns } from '@trg_package/schemas-reporting/types';
import React, { useState, useMemo, useEffect } from 'react';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  Table
} from '@trg_package/vite/components';
import clsx from 'clsx';
import { useReports } from '@/providers/ReportsProvider';
import SortingButton from '@/components/composite/SortingButton';

const ReadReport: React.FC = () => {
  const {
    fetchReportColumns,
    fetchReportData,
    fetchReportFilters,
    reportData,
    reportColumns,
    pagination,
    setPagination
  } = useReports();

  useEffect(() => {
    fetchReportData();
    fetchReportColumns();
    fetchReportFilters();
  }, []);

  const [columnDef, setColumnDef] = useState<Array<ColumnDef<GeneratedReportData>>>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const createColumnDef = useMemo(() => (column: GeneratedReportColumns): ColumnDef<
  GeneratedReportData
  > => ({
    id: column.alias,
    accessorKey: column.alias || 'No Name',
    header: ({ column: clmn }) => <SortingButton column={clmn} label={column.alias} />
  }), []);

  useEffect(() => {
    if (reportColumns) {
      const newColumnDefs = reportColumns.map(createColumnDef);
      setColumnDef(newColumnDefs);
    }
  }, [reportColumns, createColumnDef]);

  const table = useReactTable({
    data: reportData,
    columns: columnDef,
    manualPagination: true,
    rowCount: reportData.length,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    },
    initialState: {
      pagination
    }
  });

  return (
    <>
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
      <Pagination>
        <PaginationContent>
          <PaginationItem
            onClick={() => table.previousPage()}
            className={clsx(!table.getCanPreviousPage() && 'pointer-events-none opacity-50')}
          >
            <PaginationPrevious/>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{pagination.pageIndex}</PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => table.nextPage()}
            className={clsx(!table.getCanNextPage() && 'pointer-events-none opacity-50')}
          >
            <PaginationNext/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default ReadReport;
