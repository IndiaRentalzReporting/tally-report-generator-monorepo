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
import { ColumnSelect } from '@trg_package/schemas-reporting/types';
import { Trash } from 'lucide-react';

import { useCallback, useEffect, memo, useState } from 'react';
import ReportSettings from './Settings';
import { useReports } from '@/providers/ReportsProvider';
import { UpdateColumn } from './UpdateColumn';

interface DataTableProps<TData> {
  data: TData[];
}

const DataTable = <TData,>({ data }: DataTableProps<TData>) => {
  const { columns, removeColumn } = useReports();
  const [columnDef, setColumnDef] = useState<ColumnDef<TData>[]>([]);

  const createColumnDef = useCallback(
    (column: ColumnSelect): ColumnDef<ColumnSelect> => ({
      id: column.name,
      accessorKey: column.name,
      header: () => (
        <MemoizedHeaderButton column={column} removeColumn={removeColumn} />
      ),
      cell: ({ row }) => <MemoizedUpdateButton column={row.original} />
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
  column: ColumnSelect;
  removeColumn: (entity: ColumnSelect) => void;
}> = ({ column, removeColumn }) => (
  <div className="flex items-center gap-4">
    <span>{column.name}</span>
    <Button className="flex items-center justify-center" variant="ghost">
      <Trash
        color="red"
        onClick={() => removeColumn(column)}
        className="h-4 w-4"
      />
    </Button>
  </div>
);

const MemoizedHeaderButton = memo(HeaderButton);

const UpdateButton: React.FC<{ column: ColumnSelect }> = ({ column }) => (
  <div className="flex items-center justify-center h-[30vh] hover:bg-muted/50 rounded-md">
    <UpdateColumn
      module={{ id: column.name, name: column.name, type: 'Reports' }}
    />
  </div>
);

const MemoizedUpdateButton = memo(UpdateButton);

export default DataTable;
