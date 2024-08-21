import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Else, If, Then, When } from './Conditionals';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return;

  return (
    <If condition={isAuthenticated}>
      <Then>
        <Outlet />
      </Then>
      <Else>
        <Navigate to="/sign-in" />
      </Else>
    </If>
  );
};

export const PublicRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return;

  useEffect(() => {
    if (!!isAuthenticated) {
      window.location.href = 'http://dashboard.trg.local';
    }
  }, [isAuthenticated]);
  return (
    <When condition={!isAuthenticated}>
      <Outlet />
    </When>
  );
};
