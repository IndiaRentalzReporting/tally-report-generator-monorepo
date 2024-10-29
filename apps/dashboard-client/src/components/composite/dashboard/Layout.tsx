import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@trg_package/vite/components';
import Sidebar from './Sidebar';
import { NavigationProvider } from '@/providers/NavigationProvider';
import Content from './Main';

const Layout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <NavigationProvider>
        <Sidebar key={location.pathname} />
        <main className="flex flex-col w-full">
          <Content />
        </main>
      </NavigationProvider>
    </SidebarProvider>
  );
};

export default Layout;
