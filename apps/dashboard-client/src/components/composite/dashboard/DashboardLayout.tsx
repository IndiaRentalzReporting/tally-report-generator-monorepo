import { useLocation } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { NavigationProvider } from '@/providers/NavigationProvider';
import DashboardContent from './DashboardContent';

export const DashboardLayout = () => {
  const location = useLocation();

  return (
    <NavigationProvider>
      <div className="grid relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DashboardSidebar key={location.pathname} />
        <div className="flex flex-col">
          <DashboardHeader />
          <DashboardContent />
        </div>
      </div>
    </NavigationProvider>
  );
};
