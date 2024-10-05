import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@trg_package/vite/providers';
import { ElseIf, If, Then } from '@trg_package/vite/components';
import { DashboardSkeletonOverlay } from '../composite/dashboard/DashboardSkeleton';
import config from '@/config';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { PROTOCOL, VITE_AUTH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD } = config;

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      window.location.href = `${PROTOCOL}://${VITE_AUTH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`;
    }
  }, [
    isAuthenticated,
    loading,
    PROTOCOL,
    VITE_AUTH_SUBDOMAIN,
    VITE_DOMAIN,
    VITE_TLD
  ]);

  return (
    <If condition={isAuthenticated}>
      <Then>
        <Outlet />
      </Then>
      <ElseIf condition={loading}>
        <DashboardSkeletonOverlay />
      </ElseIf>
    </If>
  );
};
