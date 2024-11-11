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
      .map((permission) => SelectFormSchema.parse({
        ...permission,
        permissionId: permission.id,
        permissionAction: permission.permissionAction.map(
          (pa) => ({ action: { ...pa.action, checked: true } })
        )
      })),
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
              columns={columns()}
              data={allPermissions}
              enableSorting
              enableGrouping
              grouping={{
                rowGrouping,
                onGroupingChange: setRowGrouping
              }}
            />
          </Skeleton>
        </CardContent>
      </Card>
    </When>
  );
};

export default Read;
