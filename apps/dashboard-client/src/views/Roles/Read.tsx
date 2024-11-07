import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  DataTable,
  When
} from '@trg_package/vite/components';
import { services } from '@/services/Roles';
import { useIsAllowed } from '@/hooks';
import { columns } from './columns';
import { SelectFormSchema } from './interface';

const Read: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Roles',
    action: 'Read'
  });

  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.roles.map((role) => SelectFormSchema.parse(role)),
    queryKey: ['Roles', 'getAll']
  });

  return (
    <When condition={isReadAllowed}>
      <Card>
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
          <CardDescription>
            Read, Update or Edit roles based on your permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton isLoading={fetchingRoles}>
            <DataTable
              columns={columns}
              data={allRoles}
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
    </When>
  );
};

export default Read;
