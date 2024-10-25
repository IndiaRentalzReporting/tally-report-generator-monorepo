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
  GroupingState
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  selection: {
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState>;
  };
  grouping: {
    rowGrouping: GroupingState;
    setRowGrouping: OnChangeFn<GroupingState>;
  };
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  selection: {
    rowSelection,
    setRowSelection
  },
  grouping: {
    rowGrouping,
    setRowGrouping
  }
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGroupingChange: setRowGrouping,
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting,
      grouping: rowGrouping ?? [],
      rowSelection: rowSelection ?? {}
    }
  });

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
      <When condition={rowSelection !== null}>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </When>
    </>
  );
};
