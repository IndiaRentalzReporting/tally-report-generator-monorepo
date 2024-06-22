import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import services from '@/services';
import { DetailedUser } from '@/models';
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
  const [rowSelection, setRowSelection] = React.useState({});
  const [users, setUsers] = React.useState<DetailedUser[]>([]);
  const { data: allUsers, isFetching: fetchingUsers } = useQuery({
    queryFn: () => services.user.getAll(),
    select: (data) => data.data.users,
    queryKey: ['users', 'getAll']
  });

  useEffect(() => setUsers(allUsers ?? []), [allUsers]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Read, Update or Edit users based on yout permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton isLoading={fetchingUsers} className="w-full h-20">
          <DataTable
            columns={columns}
            data={users}
            selection={{
              rowSelection,
              setRowSelection
            }}
          />
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default Create;
