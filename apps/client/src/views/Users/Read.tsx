import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import services from '@/services';
import { DetailedUser } from '@/models';
import { Card, Skeleton } from '@/components/ui';
import { DataTable } from '@/components/composite/table/data-table';
import { columns } from './UserColumn';

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
  );
};

export default Create;
