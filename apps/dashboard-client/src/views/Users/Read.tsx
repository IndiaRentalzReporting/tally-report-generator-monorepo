import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton,
  When,
  DataTable
} from '@trg_package/vite/components';
import { services as userServices } from '@/services/user';
import { services as roleServices } from '@/services/role';
import { columns } from './columns';
import { useIsAllowed } from '@/hooks';

const Read: React.FC = () => {
  const isUpdateAllowed = useIsAllowed({
    module: 'Users',
    action: 'Update'
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => userServices.read(),
    select: (data) => data.data.users,
    queryKey: ['users', 'getAll']
  });

  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: async () => roleServices.read(),
    select: (data) => data.data.roles,
    queryKey: ['roles', 'getAll']
  });

  const queryClient = useQueryClient();
  const { mutateAsync: assignRoleMutation, isPending: assignRoleLoading } = useMutation({
    mutationFn: () => {
      const keys = Object.keys(rowSelection);
      const selectedUsers = allUsers
        ?.map((user, index) => (keys.includes(String(index)) ? user.id : ''))
        .filter((id) => !!id) ?? [];
      const promises = selectedUsers.map(async (id) => userServices.updateOne(id, { role_id: selectedRole }));
      return Promise.all(promises);
    },
    onSettled() {
      setSelectedRole('');
      setRowSelection({});
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Read, Update or Delete users based on your permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            assignRoleMutation();
          }}
          className="flex flex-col gap-4"
        >
          <When condition={isUpdateAllowed}>
            <Select
              onValueChange={setSelectedRole}
              required
              value={selectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <Skeleton isLoading={fetchingRoles}>
                    {allRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </Skeleton>
                </SelectGroup>
              </SelectContent>
            </Select>
          </When>

          <Skeleton isLoading={fetchingUsers}>
            <DataTable
              columns={columns}
              data={allUsers}
              selection={{
                rowSelection,
                setRowSelection
              }}
              grouping={{
                rowGrouping: [],
                setRowGrouping: () => null
              }}
            />
          </Skeleton>
          <When condition={isUpdateAllowed}>
            <Button
              className="mt-8 max-w-fit"
              type="submit"
              isLoading={assignRoleLoading}
            >
              Assign Role
            </Button>
          </When>
        </form>
      </CardContent>
    </Card>
  );
};

export default Read;
