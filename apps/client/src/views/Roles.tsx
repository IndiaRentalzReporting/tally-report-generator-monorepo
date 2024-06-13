import * as React from 'react';
import { CreatePermissions, User } from '@fullstack_package/interfaces';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label, Skeleton, Switch } from '@/components/ui';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import services from '@/services';
import { showSuccessAlert } from '@/lib/utils';
import { DataTable } from '@/components/composite/table/data-table';
import { columns } from '@/components/composite/table/column';
import { Else, If, Then } from '@/components/utility';

const CreateRole: React.FC = () => {
  const [roleName, setRoleName] = React.useState<string>('');

  const initialPermissions: CreatePermissions = {
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
    can_export: false,
    can_import: false
  };
  const [rolePermissions, setRolePermissions] =
    React.useState<CreatePermissions>(initialPermissions);

  const handleRoleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRoleName(e.target.value);

  const handleActionsChange = (checked: boolean, key: string) =>
    setRolePermissions((prev) => {
      return {
        ...prev,
        [key]: checked
      };
    });

  const { data: actions } = useQuery({
    queryFn: () => services.action.getAll(),
    select(data) {
      return data.data.actions;
    },
    queryKey: ['actions', 'getAll'],
    retry: false,
    refetchOnMount: false
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createRole } = useMutation({
    mutationFn: ({ rn, rp }: { rn: string; rp: CreatePermissions }) =>
      services.role.createOne({
        roleName: rn,
        rolePermissions: rp
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', 'getAll'] });
      setRolePermissions(initialPermissions);
      showSuccessAlert('Role created successfully!');
    }
  });

  const handleRoleCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    createRole({ rn: roleName, rp: rolePermissions });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Role</CardTitle>
        {/* <CardDescription>
            Create roles for Role Based Access Control
          </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRoleCreation}>
          <Input
            required
            minLength={3}
            placeholder="Role Name"
            value={roleName}
            onChange={handleRoleNameChange}
          />
          <CardHeader className="px-0">
            <CardTitle className="text-base font-normal">
              Assign Permissions
            </CardTitle>
            {/* <CardDescription>Assign permissions to your role</CardDescription> */}
          </CardHeader>
          <div className="flex space-x-4 justify-between">
            {actions?.map((action) => (
              <div className="flex flex-col items-center space-y-2">
                <Switch
                  id={action.name}
                  onCheckedChange={(checked) =>
                    handleActionsChange(
                      checked,
                      `can_${action.name.toLowerCase()}`
                    )
                  }
                />
                <Label className="text-xs" htmlFor={action.name}>
                  {action.name}
                </Label>
              </div>
            ))}
          </div>
          <Button className="mt-8" type="submit">
            Create Role
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const AssignRole: React.FC = () => {
  const [roles, setRoles] = React.useState<
    { id: string; name: string; createdAt: Date; updatedAt: Date }[]
  >([]);
  const [users, setUsers] = React.useState<(User & { roles: string[] })[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const { data: allUsers, isFetching: fetchingUsers } = useQuery({
    queryFn: () => services.user.getAll(),
    queryKey: ['users', 'getAll'],
    staleTime: Infinity
  });

  const { data: allRoles, isFetching: fetchingRoles } = useQuery({
    queryFn: async () => services.role.getAll(),
    queryKey: ['role', 'getAll'],
    staleTime: Infinity
  });

  React.useEffect(() => setUsers(allUsers?.data.users ?? []), [allUsers]);
  React.useEffect(() => setRoles(allRoles?.data.roles ?? []), [allRoles]);

  const handleRoleAssignment = async () => {
    const keys = Object.keys(rowSelection);
    const selectedUsers = users
      .map((user, index) => (keys.includes(String(index)) ? user.id : ''))
      .filter((id) => !!id);
    await services.user.assignRole(selectedUsers, selectedRole);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assign Role</CardTitle>
        {/* <CardDescription>
            Select Roles to assign to a particular user
          </CardDescription> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select onValueChange={setSelectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <If condition={fetchingRoles}>
                <Then>
                  <Skeleton className="w-full h-10" />
                </Then>
                <Else>
                  {roles.map((role) => (
                    <SelectItem value={role.id}>{role.name}</SelectItem>
                  ))}
                </Else>
              </If>
            </SelectGroup>
          </SelectContent>
        </Select>
        <If condition={fetchingUsers}>
          <Then>
            <Skeleton className="w-full h-20" />
          </Then>
          <Else>
            <DataTable
              columns={columns}
              data={users}
              selection={{
                rowSelection,
                setRowSelection
              }}
            />
          </Else>
        </If>
        <Button className="mt-8 max-w-fit" onClick={handleRoleAssignment}>
          Assign Role
        </Button>
      </CardContent>
    </Card>
  );
};

const Roles: React.FC = () => {
  return (
    <>
      <CreateRole />
      <AssignRole />
    </>
  );
};

export default Roles;
