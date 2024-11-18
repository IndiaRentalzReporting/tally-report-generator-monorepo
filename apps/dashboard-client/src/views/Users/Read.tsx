import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  When,
  DataTable
} from '@trg_package/vite/components';
import { services as userServices } from '@/services/Users';
import { useIsAllowed } from '@/hooks';
import { columns } from './columns';
import { SelectFormSchema as UserSelectFormSchema } from './interface';

const Read: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Users',
    action: 'Read'
  });

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => userServices.read(),
    select: (data) => data.data.users.map((user) => UserSelectFormSchema.parse(user)),
    queryKey: ['Users', 'getAll']
  });

  return (
    <When condition={isReadAllowed}>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Read, Update or Delete users based on your permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton isLoading={fetchingUsers}>
            <DataTable
              columns={columns}
              data={allUsers}
              enableSorting
            />
          </Skeleton>
        </CardContent>
      </Card>
    </When>
  );
};

export default Read;
