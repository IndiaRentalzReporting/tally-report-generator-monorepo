import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { When } from '@trg_package/components';
import config from '@/config';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { PROTOCOL, VITE_AUTH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD } = config;

  if (loading) return;

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = `${PROTOCOL}://${VITE_AUTH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`;
    }
  }, [isAuthenticated]);

  return (
    <When condition={isAuthenticated}>
      <Outlet />
    </When>
  );
};
