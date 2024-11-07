import React from 'react';
import {
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';
import Sidebar from './Sidebar';
import DataTable from './Table';
import Conditions from './Conditions';
import Filters from './Filters';
import GroupBy from './GroupBy';

const Update: React.FC = () => {
  const { updateReport, isUpdatingReport } = useReports();
  return (
    <>
      <Sidebar />
      <main className="flex flex-col p-6 space-y-6" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
        <DataTable data={[{}]} />
        <Card>
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <GroupBy />
              <Conditions />
              <Filters />
            </div>
          </CardContent>
        </Card>
        <Button className='w-min' onClick={() => updateReport()} isLoading={isUpdatingReport}>Update Report</Button>
      </main>
    </>
  );
};

export default Update;
