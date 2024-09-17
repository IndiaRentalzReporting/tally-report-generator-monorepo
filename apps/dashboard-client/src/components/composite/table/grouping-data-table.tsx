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
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  When
} from '@trg_package/components';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  selection?: {
    rowSelection: RowSelectionState | null;
    setRowSelection: OnChangeFn<RowSelectionState>;
  };
  grouping?: {
    grouping: GroupingState | null;
    setGrouping: OnChangeFn<GroupingState>;
  };
}

export const GroupingDataTable = <TData, TValue>({
  columns,
  data,
  selection = {
    rowSelection: null,
    setRowSelection: () => null
  },
  grouping = {
    grouping: null,
    setGrouping: () => null
  }
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: selection.setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGroupingChange: grouping.setGrouping,
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting,
      grouping: grouping.grouping ?? [],
      rowSelection: selection.rowSelection ?? {}
    }
  });

  return (
    <>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
                })}
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
                      {cell.getIsGrouped() ? (
                        // If it's a grouped cell, add an expander and row count
                        <Button
                          variant="ghost"
                          onClick={row.getToggleExpandedHandler()}
                          className="gap-2"
                        >
                          {row.getIsExpanded() ? <ArrowDown /> : <ArrowRight />}{' '}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}{' '}
                          ({row.subRows.length})
                        </Button>
                      ) : cell.getIsAggregated() ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        flexRender(
                          cell.column.columnDef.aggregatedCell ??
                            cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
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
      <When condition={selection.rowSelection !== null}>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </When>
    </>
  );
};
