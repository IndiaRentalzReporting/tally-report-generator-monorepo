import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/composite/table/data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton
} from '@/components/ui';
import { services } from './services';
import { columns } from './columns';

const ReadModule: React.FC = () => {
  const { data: allModules = [], isFetching: fetchingModules } = useQuery({
    queryFn: async () => services.getAll(),
    select: (data) => data.data.modules,
    queryKey: ['modules', 'getAll']
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Modules</CardTitle>
        <CardDescription>
          Read, Update or Edit modules based on your permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Skeleton isLoading={fetchingModules}>
          <DataTable columns={columns} data={allModules} />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default ReadModule;
