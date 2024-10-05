import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ElseIf, If, LoadingSpinner, Then } from '@trg_package/components';
import { useAuth } from '../providers';
import config from '../config';

export const PublicRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { PROTOCOL, VITE_DASH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD } = config;

  useEffect(() => {
    if (!!isAuthenticated && !loading) {
      window.location.href = `${PROTOCOL}://${VITE_DASH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`;
    }
  }, [
    isAuthenticated,
    loading,
    PROTOCOL,
    VITE_DASH_SUBDOMAIN,
    VITE_DOMAIN,
    VITE_TLD
  ]);

  return (
    <If condition={!isAuthenticated}>
      <Then>
        <Outlet />
      </Then>
      <ElseIf condition={!loading && isAuthenticated}>
        <LoadingSpinner />
      </ElseIf>
    </If>
  );
};

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

  console.log(
    {
      isAuthenticated,
      loading,
      PROTOCOL,
      VITE_AUTH_SUBDOMAIN,
      VITE_DOMAIN,
      VITE_TLD
    },
    'private routes'
  );

  return (
    <If condition={isAuthenticated}>
      <Then>
        <Outlet />
      </Then>
      <ElseIf condition={loading}>
        <LoadingSpinner />
      </ElseIf>
    </If>
  );
};