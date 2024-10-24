import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useToast } from '@trg_package/vite/hooks';
import { object } from 'zod';
import { SidebarProvider } from '@trg_package/vite/components';
import Sidebar from './Sidebar';
import DashboardHeader from '../dashboard/DashboardHeader';
import DataTable from './Table';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services } from '@/services/reports';

const ReportingLayout = () => {
  const { toast } = useToast();
  const { reportId } = useParams<{ reportId: string }>();
  const { data: report } = useQuery({
    queryKey: ['reports', 'getOne', reportId],
    queryFn: () => services.read({ id: reportId }),
    select: (data) => data.data.reports[0],
    throwOnError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    },
    enabled: !!reportId
  });

  if (!report) return null;

  return (
    <SidebarProvider>
      <ReportsProvider report={report}>
        <Sidebar />
        <main className="flex flex-col" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
          <DashboardHeader />
          <DataTable data={[object]} />
        </main>
      </ReportsProvider>
    </SidebarProvider>
  );
};

export default ReportingLayout;
