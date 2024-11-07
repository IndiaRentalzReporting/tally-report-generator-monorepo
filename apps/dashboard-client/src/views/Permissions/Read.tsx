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
  DataTable,
  When
} from '@trg_package/vite/components';
import { services } from '@/services/Permissions';
import { useIsAllowed } from '@/hooks';
import { columns } from './columns';
import { SelectFormSchema } from './interface';

const Read: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Roles',
    action: 'Read'
  });

  const [rowGrouping, setRowGrouping] = React.useState<GroupingState>(['Role Name']);
  const { data: allPermissions = [], isFetching: fetchingPermissions } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.permissions
      .filter(({ module }) => !!module)
      .map((permission) => {
        try {
          SelectFormSchema.parse(permission);
        } catch (error) {
          console.error(error);
        }
        return SelectFormSchema.parse(permission);
      }),
    queryKey: ['Permissions', 'getAll']
  });

  return (
    <When condition={isReadAllowed}>
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
                rowGrouping,
                setRowGrouping
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
