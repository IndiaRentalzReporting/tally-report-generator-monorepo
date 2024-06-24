/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SkeletonOverlay } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { When } from '../../utility';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import {
  NavigationProviderState,
  useNav
} from '@/providers/NavigationProvider';
import CreateDrawer from './CreateDrawer';

export const DashboardLayout = () => {
  const { loading, permissions } = useAuth();
  const navState = useNav();
  const location = useLocation();

  const currentModule = useMemo(
    () => navState.find((nav) => !!nav.isActive),
    [navState]
  );

  const isCreateAllowed = useMemo(
    () =>
      permissions.find(
        (permission) =>
          permission.module.name === currentModule?.name &&
          permission.actions.includes('Create')
      ),
    [permissions, currentModule]
  );

  return (
    <div className="grid relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <When condition={loading}>
        <SkeletonOverlay className="w-screen h-screen absolute z-10" />
      </When>
      <DashboardSidebar key={location.pathname} />
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center w-full justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">
              {currentModule?.name}
            </h1>
            <When condition={!!isCreateAllowed}>
              <CreateDrawer module={currentModule?.name} />
            </When>
          </div>
          <div
            className="flex flex-col gap-6  rounded-lg shadow-sm w-full h-full relative"
            x-chunk="dashboard-02-chunk-1"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
