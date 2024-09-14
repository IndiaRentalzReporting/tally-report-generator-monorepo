import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@trg_package/providers';
import { ElseIf, If, Then } from '@trg_package/components';
import config from '@/config';
import RedirectingSkeleton from '../composite/RedirectingSkeleton';

export const PublicRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { PROTOCOL, VITE_DASH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD } = config;

  useEffect(() => {
    if (!!isAuthenticated && !loading) {
      window.location.href = `${PROTOCOL}://${VITE_DASH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`;
    }
  }, [isAuthenticated]);

  return (
    <If condition={!isAuthenticated}>
      <Then>
        <Outlet />
      </Then>
      <ElseIf condition={!loading && isAuthenticated}>
        <RedirectingSkeleton />
      </ElseIf>
    </If>
  );
};
