import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { DataTable } from '@/components/composite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton
} from '@/components/ui';
import { services } from './services';
import { columns } from './columns';

const Read: React.FC = () => {
  const { data: allActions = [], isFetching: fetchingActions } = useQuery({
    queryFn: () => services.getAll(),
    select: (data) => data.data.actions,
    queryKey: ['actions', 'getAll']
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Actions</CardTitle>
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
