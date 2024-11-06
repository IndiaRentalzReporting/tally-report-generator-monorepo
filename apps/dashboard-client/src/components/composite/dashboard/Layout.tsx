import { SidebarProvider } from '@trg_package/vite/components';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './Sidebar';
import { NavigationProvider } from '@/providers/NavigationProvider';
import Content from './Main';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services } from '@/services/Reports';

const Layout = () => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id');

  const { data: report } = useQuery({
    queryKey: ['reports', 'getOne', reportId],
    queryFn: () => services.read({ id: reportId! }),
    select: (data) => data.data.reports[0],
    enabled: !!reportId
  });

  return (
    <SidebarProvider>
      <NavigationProvider>
        <ReportsProvider report={report}>
          <Sidebar/>
          <main className="flex flex-col w-full" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
            <Content />
          </main>
        </ReportsProvider>
      </NavigationProvider>
    </SidebarProvider>
  );
};

export default Layout;
