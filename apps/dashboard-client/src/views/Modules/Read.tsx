import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  DataTable,
  When
} from '@trg_package/vite/components';
import { services } from '@/services/Modules';
import { useIsAllowed } from '@/hooks';
import { columns } from './columns';
import { SelectFormSchema } from './interface';

const ReadModule: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Modules',
    action: 'Read'
  });

  const { data: allModules = [], isFetching: fetchingModules } = useQuery({
    queryFn: async () => services.read(),
    select: (data) => data.data.modules.map((module) => SelectFormSchema.parse(module)),
    queryKey: ['modules', 'getAll']
  });

  return (
    <When condition={isReadAllowed}>
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
    </When>
  );
};

export default ReadModule;
