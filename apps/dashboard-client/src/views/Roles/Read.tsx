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
import { services } from '@/services/role';
import { columns } from './columns';

const Read: React.FC = () => {
  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.roles,
    queryKey: ['roles', 'getAll']
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Roles</CardTitle>
        <CardDescription>
          Read, Update or Edit roles based on your permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton isLoading={fetchingRoles}>
          <DataTable columns={columns} data={allRoles} />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default Read;
