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
import { services } from '@/services/Actions';
import { columns } from './columns';
import { SelectFormSchema } from './interface';

const Read: React.FC = () => {
  const { data: allActions = [], isFetching: fetchingActions } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.actions.map((action) => SelectFormSchema.parse(action)),
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
          <DataTable
            columns={columns}
            data={allActions}
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

export default Read;
