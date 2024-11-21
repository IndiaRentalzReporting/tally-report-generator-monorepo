import React from 'react';
import { Outlet } from 'react-router';
import { SidebarInset, When } from '@trg_package/vite/components';
import { Link } from 'react-router-dom';
import { useNav } from '@/providers/NavigationProvider';
import Create from './Create';

export const Main: React.FC = () => {
  const { currentModule } = useNav();

  return (
    <SidebarInset className="flex w-full flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <When condition={!!currentModule}>
        <div className="flex items-center w-full justify-between">
          <Link to={`/dashboard/${currentModule}/Read`}>
            <h1 className="text-lg font-semibold md:text-2xl">{currentModule}</h1>
          </Link>
          <Create module={currentModule!} />
        </div>
      </When>
      <div className="flex flex-col gap-6  rounded-lg shadow-sm w-full h-full relative">
        <Outlet />
      </div>
    </SidebarInset>
  );
};
