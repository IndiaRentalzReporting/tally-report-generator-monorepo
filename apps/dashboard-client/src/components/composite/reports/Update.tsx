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
      <main className="flex flex-col" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
        <DataTable data={[Object]} />
        <ReportSettings />
        <Button onClick={() => updateReport()} isLoading={isUpdatingReport}>Update Report</Button>
      </main>
    </>
  );
};

export default Update;
