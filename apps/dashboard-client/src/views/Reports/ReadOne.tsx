import React, { useEffect, useState } from 'react';
import {
  ColumnDef
} from '@tanstack/react-table';
import { GeneratedReportData } from '@trg_package/schemas-reporting/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';
import { createColumn } from './columns';
import Filters from '@/components/composite/reports/ReportFilters';

const Read: React.FC = () => {
  const { reportData, reportColumns } = useReports();
  const [columnDef, setColumnDef] = useState<Array<ColumnDef<GeneratedReportData>>>([]);

  useEffect(() => {
    if (reportColumns) {
      const newColumnDefs = reportColumns.map(createColumn);
      setColumnDef(newColumnDefs);
    }
  }, [reportColumns]);

  return (
    <Card>
    <CardHeader>
      <CardTitle className='flex justify-between items-center'>
        Report
        <Filters/>
      </CardTitle>
      <CardDescription>
        Add filters to narrow down the report!
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <DataTable
        columns={columnDef}
        data={reportData.data}
        selection={{
          rowSelection: {},
          setRowSelection: () => {}
        }}
        grouping={{
          rowGrouping: [],
          setRowGrouping: () => {}
        }}
        usePagination
      />
    </CardContent>
  </Card>

  );
};

export default Read;
