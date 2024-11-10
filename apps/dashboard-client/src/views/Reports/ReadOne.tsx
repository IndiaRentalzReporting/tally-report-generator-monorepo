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
  Table,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@trg_package/vite/components';
import { cn } from '@trg_package/vite/lib/utils';
import { useReports } from '@/providers/ReportsProvider';
import { SortingButton } from '@/components/composite/SortingButton';
import Filters from '@/components/composite/reports/ReportFilters';

const ReadReport: React.FC = () => {
  const {
    fetchReportColumns,
    fetchReportFilters,
    reportData,
    reportColumns,
    pagination,
    setPagination
  } = useReports();

  useEffect(() => {
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
    data: reportData.data,
    columns: columnDef,
    manualPagination: true,
    rowCount: reportData.totalCount,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          Report
          <Filters/>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
              className={cn(!table.getCanPreviousPage() && 'pointer-events-none opacity-50')}
            >
              <PaginationPrevious/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{pagination.pageIndex + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem
              onClick={() => table.nextPage()}
              className={cn(!table.getCanNextPage() && 'pointer-events-none opacity-50')}
            >
              <PaginationNext/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
};

export default ReadReport;
