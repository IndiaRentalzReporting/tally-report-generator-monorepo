import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@trg_package/vite/components';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { NavigationProvider } from '@/providers/NavigationProvider';
import DashboardContent from './DashboardContent';

export const DashboardLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <NavigationProvider>
        <DashboardSidebar key={location.pathname} />
        <main className="flex flex-col w-full">
          <DashboardHeader />
          <DashboardContent />
        </main>
      </NavigationProvider>
    </SidebarProvider>
  );
};
