import {
  ColumnDef
} from '@tanstack/react-table';
import {
  DataTable
} from '@trg_package/vite/components';
import { useEffect, useState } from 'react';
import { GeneratedReportData } from '@trg_package/schemas-reporting/types';
import { useReports } from '@/providers/ReportsProvider';
import { createColumn } from './columns';

interface TableProps<TData> {
  data: TData[]
}

const Table = <TData extends GeneratedReportData>({ data }: TableProps<TData>) => {
  const {
    columns, removeColumn
  } = useReports();
  const [columnDef, setColumnDef] = useState<ColumnDef<TData>[]>([]);

  useEffect(() => {
    if (columns) {
      const newColumnDefs = columns.map((column) => createColumn(column, removeColumn));
      setColumnDef(newColumnDefs as ColumnDef<TData>[]);
    }
  }, [columns, removeColumn]);

  return (
      <DataTable
        data={data}
        columns={columnDef}
        selection={{
          rowSelection: {},
          setRowSelection: () => {}
        }}
        grouping={{
          rowGrouping: [],
          setRowGrouping: () => {}
        }}
      />
  );
};

export default Table;
