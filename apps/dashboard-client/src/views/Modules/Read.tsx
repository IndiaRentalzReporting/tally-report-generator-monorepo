import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  DataTable
} from '@trg_package/vite/components';
import { services } from '@/services/module';
import { columns } from './columns';

const ReadModule: React.FC = () => {
  const { data: allModules = [], isFetching: fetchingModules } = useQuery({
    queryFn: async () => services.read(),
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
          <DataTable
            columns={columns}
            data={allModules}
            grouping={{
              rowGrouping: [],
              setRowGrouping: () => null
            }}
            selection={{
              rowSelection: {},
              setRowSelection: () => null
            }}
          />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default ReadModule;
