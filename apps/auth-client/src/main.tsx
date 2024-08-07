import ReactDOM from 'react-dom/client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

import 'react-toastify/ReactToastify.css';
import { Toaster } from './components/ui';
import { ThemeProvider } from './providers/ThemeProvider';

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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col h-screen">
          <App />
        </div>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
