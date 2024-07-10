import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { GroupingState } from '@tanstack/react-table';
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
import { GroupingDataTable } from '@/components/composite/table/grouping-data-table';

const Read: React.FC = () => {
  const [grouping, setGrouping] = React.useState<GroupingState>(['Role Name']);
  const { data: allPermissions = [], isFetching: fetchingPermissions } =
    useQuery({
      queryFn: () => services.getAll(),
      select: (data) => data.data.permissions,
      queryKey: ['permissions', 'getAll']
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Permissions</CardTitle>
        <CardDescription>
          Read, Update or Edit permissions based on your permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton isLoading={fetchingPermissions}>
          <GroupingDataTable
            columns={columns}
            data={allPermissions}
            grouping={{
              grouping,
              setGrouping
            }}
          />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default Read;
