import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  DataTable
} from '@trg_package/vite/components';
import { services } from '@/services/reports';
import { columns } from './columns';

const Read: React.FC = () => {
  const { data: allActions = [], isFetching: fetchingActions } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.reports,
    queryKey: ['actions', 'getAll']
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Reports</CardTitle>
        <CardDescription>
          Read, Update or Edit actions based on your permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton isLoading={fetchingActions}>
          <DataTable columns={columns} data={allActions} />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default Read;
