/* eslint-disable no-nested-ternary */
import { useQuery } from '@tanstack/react-query';
import { Loading, SidebarProvider } from '@trg_package/vite/components';
import { useParams } from 'react-router-dom';
import React from 'react';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services } from '@/services/Reports';
import { NavigationProvider } from '@/providers/NavigationProvider';
import Sidebar from './Sidebar';
import DashboardLayout from '../dashboard/Layout';
import Main from '../Main';

const ReportingLayout: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();

  const { data: report, isFetching } = useQuery({
    queryKey: ['reports', 'getOne', reportId],
    queryFn: () => services.read({ id: reportId! }),
    select: (data) => data.data.reports[0],
    enabled: !!reportId
  });

  return (
    isFetching
      ? <Loading />
      : report
        ? <ReportsProvider report={report}>
            <SidebarProvider>
              <NavigationProvider>
                <Sidebar/>
                <Main/>
              </NavigationProvider>
            </SidebarProvider>
          </ReportsProvider>
        : <DashboardLayout/>
  );
};

export default ReportingLayout;
