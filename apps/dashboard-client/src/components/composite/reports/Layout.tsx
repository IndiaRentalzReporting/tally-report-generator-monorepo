import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useToast } from '@trg_package/vite/hooks';
import { object } from 'zod';
import Sidebar from './Sidebar';
import DashboardHeader from '../dashboard/DashboardHeader';
import DataTable from './Table';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services } from '@/services/reports';

const Layout = () => {
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
    <ReportsProvider report={report}>
      <div className="grid relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <DashboardHeader />
          <DataTable data={[object]} />
        </div>
      </div>
    </ReportsProvider>
  );
};

export default Layout;
