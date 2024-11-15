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
import Conditions from '@/components/composite/reports/AddConditions';
import Filters from '@/components/composite/reports/AddFilters';
import GroupBy from '@/components/composite/reports/AddGroupBy';
import AvailableColumns from '@/components/composite/reports/AddColumns';

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
      <CardContent className="grid grid-cols-4 grid-rows-2 gap-6">
        <Card className='row-span-2'>
          <CardHeader>
            <CardTitle>Add Columns</CardTitle>
            <CardDescription>
              Columns that will be used to generate the report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailableColumns/>
          </CardContent>
        </Card>
        <div className='col-span-3 row-span-2 flex flex-col gap-6'>
          <DataTable
            emptyDataMessage='No Columns'
            data={columnDef.length ? [{}] : []}
            columns={columnDef}
          />
          <Card className='flex-grow'>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>
                These are the settings that will be used to generate the report.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-6'>
              <GroupBy />
              <Conditions />
              <Filters />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdateReport;
