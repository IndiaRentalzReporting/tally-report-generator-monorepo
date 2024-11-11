/* eslint-disable no-nested-ternary */
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@trg_package/vite/components';
import { Outlet, useParams } from 'react-router-dom';
import React from 'react';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services } from '@/services/Reports';

const ReportingLayout: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();

  const { data: report, isFetching } = useQuery({
    queryKey: ['Reports', 'getOne', reportId],
    queryFn: () => services.read({ id: reportId! }),
    select: (data) => data.data.reports[0],
    enabled: !!reportId
  });

  return (
    isFetching
      ? <Loading />
      : report
        ? <ReportsProvider report={report}>
            <Outlet />
          </ReportsProvider>
        : <Outlet/>
  );
};

export default ReportingLayout;
