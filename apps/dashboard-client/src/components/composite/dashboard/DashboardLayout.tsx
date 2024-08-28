/* eslint-disable no-param-reassign */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SkeletonOverlay } from '@trg_package/components';
import { useAuth } from '@/providers/AuthProvider';
import { When } from '../../utility';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { NavigationProvider } from '@/providers/NavigationProvider';
import DashboardContent from './DashboardContent';

export const DashboardLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();

  return (
    <NavigationProvider>
      <div className="grid relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <When condition={loading}>
          <SkeletonOverlay className="w-screen h-screen absolute z-10" />
        </When>
        <DashboardSidebar key={location.pathname} />
        <div className="flex flex-col">
          <DashboardHeader />
          <DashboardContent />
        </div>
      </div>
    </NavigationProvider>
  );
};
