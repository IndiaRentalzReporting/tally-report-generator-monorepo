import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@/providers/ThemeProvider';
import 'react-toastify/ReactToastify.css';
import { NavigationProvider } from '@/providers/NavigationProvider';

export const RootLayout = () => {
  return (
    <NavigationProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastContainer />
        <Outlet />
      </ThemeProvider>
    </NavigationProvider>
  );
};
