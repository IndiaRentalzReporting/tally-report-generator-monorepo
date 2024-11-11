import { SidebarProvider } from '@trg_package/vite/components';
import { NavigationProvider } from '@/providers/NavigationProvider';
import Sidebar from './Sidebar';
import { Main } from './Main';

const Layout = () => (
    <SidebarProvider>
      <NavigationProvider>
        <Sidebar/>
        <Main />
      </NavigationProvider>
    </SidebarProvider>
);

export default Layout;
