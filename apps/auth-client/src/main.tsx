import ReactDOM from 'react-dom/client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './globals.css';
import '@trg_package/components/styles.css';

import 'react-toastify/ReactToastify.css';
import { Toaster } from '@trg_package/components';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="flex flex-col h-screen">
            <App />
          </div>
        </ThemeProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
