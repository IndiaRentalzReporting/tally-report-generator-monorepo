'use client';

import {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
  getGroupedRowModel,
  GroupingState,
  PaginationState,
  TableOptions
} from '@tanstack/react-table';

import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import {
  Else,
  ElseIf,
  If,
  Then,
  When
} from '../Conditionals';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
} from './pagination';
import { cn } from '$/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableSorting?: boolean;
  enableSelection?: boolean;
  enableGrouping?: boolean;
  enablePagination?: boolean;
  selection?: {
    rowSelection: RowSelectionState;
    onRowSelectionChange: OnChangeFn<RowSelectionState>;
  };
  grouping?: {
    rowGrouping: GroupingState;
    onGroupingChange: OnChangeFn<GroupingState>;
  };
  pagination?: {
    totalCount: number;
    paginationState: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
  };
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  enableSorting = false,
  enableSelection = false,
  enableGrouping = false,
  enablePagination = false,
  selection,
  grouping,
  pagination,
}: DataTableProps<TData, TValue>) => {
  const [sorting, onSortingChange] = React.useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalGrouping, setInternalGrouping] = React.useState<GroupingState>([]);
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableOptions: Partial<TableOptions<TData>> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  };

  if (enableSorting) {
    tableOptions.onSortingChange = onSortingChange;
    tableOptions.getSortedRowModel = getSortedRowModel();
    tableOptions.state = {
      ...tableOptions.state,
      sorting,
    };
  }

  if (enableSelection && selection) {
    const { rowSelection, onRowSelectionChange } = selection;
    tableOptions.onRowSelectionChange = onRowSelectionChange || setInternalRowSelection;
    tableOptions.state = {
      ...tableOptions.state,
      rowSelection: rowSelection || internalRowSelection,
    };
  }

  if (enableGrouping && grouping) {
    const { rowGrouping, onGroupingChange } = grouping;
    tableOptions.onGroupingChange = onGroupingChange || setInternalGrouping;
    tableOptions.getGroupedRowModel = getGroupedRowModel();
    tableOptions.getExpandedRowModel = getExpandedRowModel();
    tableOptions.state = {
      ...tableOptions.state,
      grouping: rowGrouping || internalGrouping,
    };
  }

  if (enablePagination && pagination) {
    const { paginationState, onPaginationChange, totalCount } = pagination;
    tableOptions.manualPagination = true,
    tableOptions.rowCount = totalCount,
    tableOptions.onPaginationChange = onPaginationChange || setInternalPagination;

    tableOptions.state = {
      ...tableOptions.state,
      pagination: paginationState || internalPagination,
    };
  }

  const table = useReactTable(tableOptions as TableOptions<TData>);

  return (
    <>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <If condition={cell.getIsGrouped()}>
                        <Then>
                          <Button
                            variant="ghost"
                            onClick={row.getToggleExpandedHandler()}
                            className="gap-2"
                          >
                            {row.getIsExpanded() ? (
                              <ArrowDown />
                            ) : (
                              <ArrowRight />
                            )}{' '}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}{' '}
                            ({row.subRows.length})
                          </Button>
                        </Then>
                        <ElseIf condition={cell.getIsAggregated()}>
                          {flexRender(
                            cell.column.columnDef.aggregatedCell
                              ?? cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </ElseIf>
                        <ElseIf condition={cell.getIsPlaceholder()} />
                        <Else>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Else>
                      </If>
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
      <When condition={!!selection && !!enableSelection}>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
      </When>
      <When condition={!!pagination && !!enablePagination}>
        <Pagination className='justify-end'>
          <PaginationContent>
            <PaginationItem
              onClick={() => table.previousPage()}
              className={cn(!table.getCanPreviousPage() && 'pointer-events-none opacity-50')}
            >
              <PaginationPrevious/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{table.getState().pagination.pageIndex + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem
              onClick={() => table.nextPage()}
              className={cn(!table.getCanNextPage() && 'pointer-events-none opacity-50')}
            >
              <PaginationNext/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </When>
    </>
  );
};
