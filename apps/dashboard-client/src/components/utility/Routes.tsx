import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Else, If, Then, When } from './Conditionals';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return;

  useEffect(() => {
    console.log({ isAuthenticated }, 'dashboard');
    if (!isAuthenticated) {
      window.location.href = 'http://auth.trg.local';
    }
  }, [isAuthenticated]);

  return (
    <When condition={isAuthenticated}>
      <Outlet />
    </When>
  );
};
