import { SidebarProvider } from '@trg_package/vite/components';
import Sidebar from './Sidebar';
import { NavigationProvider } from '@/providers/NavigationProvider';
import Main from '../Main';

const Layout = () => (
    <SidebarProvider>
      <NavigationProvider>
        <Sidebar/>
        <Main />
      </NavigationProvider>
    </SidebarProvider>
);

export default Layout;
