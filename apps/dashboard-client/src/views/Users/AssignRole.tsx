import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { DataTable } from '@/components/composite/table/data-table';
import {
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
  Card
} from '@trg_package/components';
import { services } from './services';
import { services as roleServices } from '../Roles/services';
import { columnsWithSelection as columns } from './columns';

const AssignRole: React.FC = () => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const { data: allUsers = [] } = useQuery({
    queryFn: () => services.getAll(),
    select: (data) => data.data.users.filter((user) => !user.role),
    queryKey: ['users', 'getAll']
  });

  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: async () => roleServices.getAll(),
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
          services.updateOne(id, { role_id: selectedRole })
        );
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
        <CardTitle>Assign Role</CardTitle>
        <CardDescription>Select a Role to assign to users</CardDescription>
      </CardHeader>
      <CardContent>
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
              columns={columns}
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
    </Card>
  );
};

export default AssignRole;
