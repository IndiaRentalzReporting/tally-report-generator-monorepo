/* eslint-disable no-nested-ternary */
import { useQuery } from '@tanstack/react-query';
import { Loading, useSidebar } from '@trg_package/vite/components';
import { Outlet, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ReportsProvider } from '@/providers/ReportsProvider';
import { services } from '@/services/Reports';

const ReportingLayout: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { setOpen } = useSidebar();

  const { data: report, isFetching } = useQuery({
    queryFn: () => services.read({ id: reportId! }),
    select: (data) => data.data.reports[0],
    queryKey: ['Reports', reportId, 'getOne'],
    enabled: !!reportId,
  });

  useEffect(() => {
    setOpen(false);
  }, []);

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
