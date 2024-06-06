import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/providers/AuthProvider';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer />
      <Outlet />
    </div>
  );
};
