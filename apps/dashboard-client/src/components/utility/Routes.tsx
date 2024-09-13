import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { ElseIf, If, Then } from '@trg_package/components';
import config from '@/config';
import DashboardSkeletonOverlay from '../composite/dashboard/DashboardSkeleton';

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { PROTOCOL, VITE_AUTH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD } = config;

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      window.location.href = `${PROTOCOL}://${VITE_AUTH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`;
    }
  }, [isAuthenticated]);

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
