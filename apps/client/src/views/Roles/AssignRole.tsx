import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { ChangeEventHandler, FormEventHandler } from 'react';
import { DataTable } from '@/components/composite/table/data-table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Skeleton,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  CardDescription,
  Checkbox
} from '@/components/ui';
import services from '@/services';
import { userColumnsWithSelection } from './columns';

const AssignRole: React.FC = () => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => services.Users.getAll(),
    select: (data) => data.data.users.filter((user) => !user.role),
    queryKey: ['users', 'getAll']
  });

  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: async () => services.Roles.getAll(),
    select: (data) => data.data.roles,
    queryKey: ['roles', 'getAll']
  });

  const queryClient = useQueryClient();
  const { mutateAsync: assignRoleMutation, isPending: assignRoleLoading } =
    useMutation({
      mutationFn: () => {
        const keys = Object.keys(rowSelection);
        const selectedUsers =
          allUsers
            ?.map((user, index) =>
              keys.includes(String(index)) ? user.id : ''
            )
            .filter((id) => !!id) ?? [];
        const promises = selectedUsers.map(async (id) =>
          services.Users.updateOne(id, { role_id: selectedRole })
        );
        return Promise.all(promises);
      },
      onSettled() {
        setSelectedRole('');
        queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
      }
    });

  return (
    <div className="w-full">
      <CardHeader className="px-0">
        <CardTitle>Assign Role</CardTitle>
        <CardDescription>Select a Role to assign to users</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            assignRoleMutation();
          }}
          className="flex flex-col gap-4"
        >
          <Select onValueChange={setSelectedRole} required value={selectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <Skeleton isLoading={fetchingRoles}>
                  {allRoles.map((role, index) => (
                    <SelectItem key={index} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </Skeleton>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Skeleton isLoading={fetchingRoles}>
            <DataTable
              columns={userColumnsWithSelection}
              data={allUsers}
              selection={{
                rowSelection,
                setRowSelection
              }}
            />
          </Skeleton>
          <Button
            className="mt-8 max-w-fit"
            type="submit"
            isLoading={assignRoleLoading}
          >
            Assign Role
          </Button>
        </form>
      </CardContent>
    </div>
  );
};

export default AssignRole;
