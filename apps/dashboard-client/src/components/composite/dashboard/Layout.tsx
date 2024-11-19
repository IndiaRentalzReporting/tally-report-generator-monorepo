import {
  SidebarProvider,
  When
} from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import { NavigationProvider } from '@/providers/NavigationProvider';
import Sidebar from './Sidebar';
import { Main } from './Main';
import FirstLoginResetPassword from '../FirstLoginResetPassword';

const Layout = () => {
  const { firstLogin } = useAuth();

  return (
    <SidebarProvider>
      <NavigationProvider>
        <Sidebar/>
        <Main />
        <When condition={!!firstLogin}>
          <FirstLoginResetPassword/>
        </When>
      </NavigationProvider>
    </SidebarProvider>
  );
};

export default Layout;
