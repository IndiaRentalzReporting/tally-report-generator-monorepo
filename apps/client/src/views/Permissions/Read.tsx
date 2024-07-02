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
import services from '@/services';
import { columns } from './columns';

const Read: React.FC = () => {
  const { data: allPermissions = [], isFetching: fetchingPermissions } =
    useQuery({
      queryFn: () => services.Permissions.getAll(),
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
          <DataTable columns={columns} data={allPermissions} />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default Read;
