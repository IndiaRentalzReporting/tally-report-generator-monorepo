import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useToast } from '@trg_package/vite/hooks';
import { object } from 'zod';
import {
  Else, ElseIf, If, Loading, SidebarProvider, Then
} from '@trg_package/vite/components';
import Sidebar from './Sidebar';
import DataTable from './Table';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services } from '@/services/Reports';

const ReportingLayout = () => {
  const { toast } = useToast();
  const { reportId } = useParams<{ reportId: string }>();
  const { data: report, isFetching } = useQuery({
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

  return (
    <SidebarProvider>
      <If condition={isFetching}>
        <Then>
          <div className='w-full h-full'>
            <Loading />
          </div>
        </Then>
        <ElseIf condition={!report && !isFetching}>
          Could not find report
        </ElseIf>
        <Else>
          {report && <ReportsProvider report={report}>
            <Sidebar />
            <main className="flex flex-col" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
              <DataTable data={[object]} />
            </main>
          </ReportsProvider>}
        </Else>
      </If>
    </SidebarProvider>
  );
};

export default ReportingLayout;
