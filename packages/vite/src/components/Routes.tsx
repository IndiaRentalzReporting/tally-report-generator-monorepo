import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ElseIf, If, Then } from './Conditionals';
import { Loading } from './Loading';
import { useAuth } from '../providers';
import config from '../config';

export const PublicRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const {
    PROTOCOL, VITE_DASH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD
  } = config;

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
      <ElseIf condition={loading}>
        <Loading />
      </ElseIf>
    </If>
  );
};

export const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const {
    PROTOCOL, VITE_AUTH_SUBDOMAIN, VITE_DOMAIN, VITE_TLD
  } = config;

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
        <Loading />
      </ElseIf>
    </If>
  );
};
