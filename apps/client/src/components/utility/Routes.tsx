import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Else, If, Then, When } from './Conditionals';
import { Skeleton } from '../ui/skeleton';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <If condition={isAuthenticated ?? false}>
      <Then>
        <When condition={loading}>
          <Skeleton className="w-screen h-screen absolute z-10" />
        </When>
        <Outlet />
      </Then>
      <Else>
        <Navigate to="/sign-in" />
      </Else>
    </If>
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
