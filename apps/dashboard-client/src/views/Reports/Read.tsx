/* eslint-disable no-nested-ternary */
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  DataTable,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@trg_package/vite/components';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable
} from '@tanstack/react-table';
import { GeneratedReportColumns, GeneratedReportData } from '@trg_package/schemas-reporting/types';
import { services } from '@/services/Reports';
import { columns } from './columns';
import { SelectFormSchema } from './interface';

import { useReports } from '@/providers/ReportsProvider';
import SortingButton from '@/components/composite/SortingButton';

const Read: React.FC = () => {
  const { data: allActions = [], isFetching: fetchingActions } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.reports.map((report) => SelectFormSchema.parse(report)),
    queryKey: ['reports', 'getAll']
  });

  return (
    isReportRoute
      ? <ReadReport/>
      : <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>
              Read, Update or Edit actions based on your permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton isLoading={fetchingActions}>
              <DataTable
                columns={columns}
                data={allActions}
                grouping={{
                  rowGrouping: [],
                  setRowGrouping: () => null
                }}
                selection={{
                  rowSelection: {},
                  setRowSelection: () => null
                }}
              />
            </Skeleton>
          </CardContent>
        </Card>
  );
};

export default Read;

const ReadReport: React.FC = () => {
  const {
    reportData,
    reportColumns,
    pagination,
    setPagination
  } = useReports();

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
            className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
          >
            <PaginationPrevious/>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{pagination.pageIndex}</PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => table.nextPage()}
            className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
          >
            <PaginationNext/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
