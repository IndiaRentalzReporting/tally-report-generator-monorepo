import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  DataTable
} from '@trg_package/vite/components';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { useReports } from '@/providers/ReportsProvider';
import { createUpdateReportColumn } from './columns';
import Settings from '@/components/composite/reports/Settings';

const UpdateReport: React.FC = () => {
  const {
    updateReport, isUpdatingReport, columns, removeColumn
  } = useReports();
  const [columnDef, setColumnDef] = useState<ColumnDef<any>[]>([]);

  useEffect(() => {
    if (columns) {
      const newColumnDefs = columns.map((column) => createUpdateReportColumn(column, removeColumn));
      setColumnDef(newColumnDefs);
    }
  }, [columns, removeColumn]);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='space-y-1.5'>
            <CardTitle>Update Report</CardTitle>
            <CardDescription>
              Update the existing report with the new settings.
            </CardDescription>
          </div>
          <Button className='w-min' variant="secondary" onClick={() => updateReport()} isLoading={isUpdatingReport}>Update Report</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <DataTable
          data={[{}]}
          columns={columnDef}
        />
        <Settings/>
      </CardContent>
    </Card>
  );
};

export default UpdateReport;
