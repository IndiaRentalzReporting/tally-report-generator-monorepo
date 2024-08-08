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
  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: () => services.getAll(),
    select: (data) => data.data.roles,
    queryKey: ['roles', 'getAll']
  });

  console.log({
    allRoles
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
