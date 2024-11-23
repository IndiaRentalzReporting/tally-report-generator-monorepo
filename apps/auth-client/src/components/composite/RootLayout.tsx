import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, AuthProvider } from '@trg_package/vite/providers';
import { Toaster } from '@trg_package/vite/components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false
    }
  }
});

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col h-screen">{children}</div>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);
