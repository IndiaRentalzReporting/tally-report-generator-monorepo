import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Else, If, Then } from './Conditionals';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
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
