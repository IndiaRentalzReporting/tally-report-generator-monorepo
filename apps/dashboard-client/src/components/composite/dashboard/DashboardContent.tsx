import React from 'react';
import { Outlet } from 'react-router';
import CreateDrawer from './CreateDrawer';
import { useNav } from '@/providers/NavigationProvider';

const DashboardContent: React.FC = () => {
  const { currentModule } = useNav();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{currentModule}</h1>
        <CreateDrawer module={currentModule} />
      </div>
      <div
        className="flex flex-col gap-6  rounded-lg shadow-sm w-full h-full relative"
        x-chunk="dashboard-02-chunk-1"
      >
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardContent;
