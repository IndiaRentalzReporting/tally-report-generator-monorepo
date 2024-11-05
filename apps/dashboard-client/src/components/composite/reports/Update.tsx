import React from 'react';
import { Button } from '@trg_package/vite/components';
import Sidebar from './Sidebar';
import DataTable from './Table';
import ReportSettings from './Settings';
import { useReports } from '@/providers/ReportsProvider';

const Update: React.FC = () => {
  const { updateReport, isUpdatingReport } = useReports();
  return (
    <>
      <Sidebar />
      <main className="flex flex-col p-6 space-y-6" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
        <DataTable data={[]} />
        <ReportSettings />
        <Button className='w-min' onClick={() => updateReport()} isLoading={isUpdatingReport}>Update Report</Button>
      </main>
    </>
  );
};

export default Update;
