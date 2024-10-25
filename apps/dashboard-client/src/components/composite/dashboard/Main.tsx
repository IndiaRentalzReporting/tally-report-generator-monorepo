import React from 'react';
import { Outlet } from 'react-router';
import { When } from '@trg_package/vite/components';
import Create from './Create';
import { useNav } from '@/providers/NavigationProvider';

const Main: React.FC = () => {
  const { currentModule } = useNav();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <When condition={!!currentModule}>
        <div className="flex items-center w-full justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">{currentModule}</h1>
          <Create module={currentModule!} />
        </div>
      </When>
      <div className="flex flex-col gap-6  rounded-lg shadow-sm w-full h-full relative">
        <Outlet />
      </div>
    </main>
  );
};

export default Main;
