import { Outlet } from 'react-router';
import { ThemeProvider } from '@/providers/ThemeProvider';
import 'react-toastify/ReactToastify.css';
import { NavigationProvider } from '@/providers/NavigationProvider';
import { Toaster } from '../ui/toaster';

export const RootLayout = () => {
  return (
    <NavigationProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col h-screen">
          <Outlet />
        </div>
        <Toaster />
      </ThemeProvider>
    </NavigationProvider>
  );
};
