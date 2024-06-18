import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
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
  CardDescription
} from '@/components/ui';
import services from '@/services';
import { columns as userColumns } from './UserColumn';
import { DetailedUser, Role } from '@/models';

const AssignRole: React.FC = () => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const [users, setUsers] = React.useState<DetailedUser[]>([]);
  const { data: allUsers, isFetching: fetchingUsers } = useQuery({
    queryFn: () => services.user.getAll(),
    select: (data) => data.data.users.filter((user) => !user.role),
    queryKey: ['users', 'getAll']
  });

  const [roles, setRoles] = React.useState<Role[]>([]);
  const { data: allRoles, isFetching: fetchingRoles } = useQuery({
    queryFn: async () => services.role.getAll(),
    select: (data) => data.data.roles,
    queryKey: ['role', 'getAll']
  });

  React.useEffect(() => setUsers(allUsers ?? []), [allUsers]);
  React.useEffect(() => setRoles(allRoles ?? []), [allRoles]);

  const queryClient = useQueryClient();
  const { mutateAsync: assignRoleMutation, isPending: assignRoleLoading } =
    useMutation({
      mutationFn: ({
        selectedUsers,
        role
      }: {
        selectedUsers: string[];
        role: string;
      }) => services.user.assignRole(selectedUsers, role),
      onSettled() {
        setSelectedRole('');
        queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
      }
    });

  const handleRoleAssignment = async () => {
    const keys = Object.keys(rowSelection);
    const selectedUsers = users
      .map((user, index) => (keys.includes(String(index)) ? user.id : ''))
      .filter((id) => !!id);
    if (selectedUsers.length > 0) {
      await assignRoleMutation({ selectedUsers, role: selectedRole });
    } else {
      // throw weeoe
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assign Role</CardTitle>
        <CardDescription>Select a Role to assign to users</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRoleAssignment} className="flex flex-col gap-4">
          <Select onValueChange={setSelectedRole} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <Skeleton isLoading={fetchingRoles} className="w-full h-10">
                  {roles.map((role) => (
                    <SelectItem value={role.id}>{role.name}</SelectItem>
                  ))}
                </Skeleton>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Skeleton isLoading={fetchingRoles} className="w-full h-20">
            <DataTable
              columns={userColumns}
              data={users}
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
    </Card>
  );
};

export default AssignRole;
