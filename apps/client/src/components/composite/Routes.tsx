import React from 'react';
import { Navigate, Outlet } from 'react-router';
import useAuthentication from '../../lib/hooks/useAuthentication';

export const PrivateRoutes: React.FC = () => {
  const isAuthenticated = useAuthentication();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoutes: React.FC = () => {
  const isAuthenticated = useAuthentication();

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export const OpenRoutes: React.FC = () => {
  return <Outlet />;
};
