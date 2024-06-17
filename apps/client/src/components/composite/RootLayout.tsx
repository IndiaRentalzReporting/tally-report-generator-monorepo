import { Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import 'react-toastify/ReactToastify.css';
import { NavigationProvider } from '@/providers/NavigationProvider';
import { AxiosPromise } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: Infinity
    }
  }
});
export const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ToastContainer />
            <Outlet />
          </ThemeProvider>
        </NavigationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
