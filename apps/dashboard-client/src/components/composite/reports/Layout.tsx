import { useParams } from 'react-router';
import { useToast } from '@trg_package/vite/hooks';
import { useQuery } from '@tanstack/react-query';
import { If, Then, Else } from '@trg_package/vite/components';
import Sidebar from './Sidebar';
import DashboardHeader from '../dashboard/DashboardHeader';
import Table from './Table';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services as reportsService } from '@/services/reports';

const Layout = () => {
  const { reportId } = useParams();
  const { toast } = useToast();

  const { data: report } = useQuery({
    queryFn: () => reportsService.read({ id: reportId }),
    select: (data) => data.data.reports[0],
    queryKey: ['tables', 'getOne', reportId]
  });

  if (!reportId) {
    toast({
      title: 'Error',
      description: 'Report ID is required'
    });
    return null;
  }

  return (
    <If condition={!report?.baseEntity}>
      <Then />
      <Else>
        <ReportsProvider tableId={report?.baseEntity!}>
          <div className="grid relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <DashboardHeader />
              <Table />
            </div>
          </div>
        </ReportsProvider>
      </Else>
    </If>
  );
};

export default Layout;
