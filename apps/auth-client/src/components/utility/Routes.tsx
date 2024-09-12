import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Else, If, Then, When } from '@trg_package/components';
import config from '@/config';

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
  const { PROTOCOL, VITE_DASH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD } = config;

  if (loading) return;

  useEffect(() => {
    if (!!isAuthenticated) {
      window.location.href = `${PROTOCOL}://${VITE_DASH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`;
    }
  }, [isAuthenticated]);

  return (
    <When condition={!isAuthenticated}>
      <Outlet />
    </When>
  );
};
