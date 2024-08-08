import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { services } from './services';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton
} from '@/components/ui';
import { DataTable } from '@/components/composite/table/data-table';
import { columns } from './columns';

const Create: React.FC = () => {
  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => services.getAll(),
    select: (data) => data.data.users,
    queryKey: ['users', 'getAll']
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Read, Update or Edit users based on your permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton isLoading={fetchingUsers}>
          <DataTable columns={columns} data={allUsers} />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default Create;
