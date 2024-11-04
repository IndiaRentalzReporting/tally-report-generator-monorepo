/* eslint-disable no-nested-ternary */
import { useQuery } from '@tanstack/react-query';
import { Outlet, useParams } from 'react-router';
import { useToast } from '@trg_package/vite/hooks';
import { Loading, SidebarProvider } from '@trg_package/vite/components';
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
      {
        isFetching
          ? <Loading />
          : report
            ? <ReportsProvider report={report}>
                  <Outlet/>
                </ReportsProvider>
            : <div className='w-full h-full'>Report not found!</div>
      }
    </SidebarProvider>
  );
};

export default ReportingLayout;
