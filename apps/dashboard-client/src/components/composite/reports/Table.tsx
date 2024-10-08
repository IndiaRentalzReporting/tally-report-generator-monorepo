import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  When
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';
import ReportSettings from './Settings';

interface DataTableProps<TData, TValue> {
  data: TData[];
}

const DataTable = <TData, TValue>({ data }: DataTableProps<TData, TValue>) => {
  const { columns } = useReports();
  const table = useReactTable({
    data,
    columns: columns.map((e) => e.column) as ColumnDef<TData, TValue>[],
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md border">
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

export default DataTable;
