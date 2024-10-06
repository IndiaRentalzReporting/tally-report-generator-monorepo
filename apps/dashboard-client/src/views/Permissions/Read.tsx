import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { GroupingState } from '@tanstack/react-table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  DataTable
} from '@trg_package/vite/components';
import { services } from '@/services/permission';
import { columns } from './columns';

const Read: React.FC = () => {
  const [grouping, setGrouping] = React.useState<GroupingState>(['Role Name']);
  const { data: allPermissions = [], isFetching: fetchingPermissions } =
    useQuery({
      queryFn: () => services.read(),
      select: (data) => data.data.permissions.filter(({ module }) => !!module),
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
          <DataTable
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
