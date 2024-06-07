import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <div className="flex flex-col h-screen">
      <Outlet />
    </div>
  ) : (
    <Navigate to="/sign-in" />
  );
};

export const PublicRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="flex flex-col h-screen">
      <Outlet />
    </div>
  );
};
