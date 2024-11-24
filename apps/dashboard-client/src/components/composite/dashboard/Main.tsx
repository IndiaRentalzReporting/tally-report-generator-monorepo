import React from 'react';
import { Outlet } from 'react-router';
import { SidebarInset } from '@trg_package/vite/components';
import Header from './Header';

export const Main: React.FC = () => (
    <SidebarInset className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
      <Header/>
      <div className="flex flex-col gap-6 rounded-lg shadow-sm w-full h-full relative">
        <Outlet />
      </div>
    </SidebarInset>
);
