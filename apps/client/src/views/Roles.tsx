import * as React from 'react';
import { CreatePermissions, User } from '@fullstack_package/interfaces';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label, Switch } from '@/components/ui';

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
import { showErrorAlert, showSuccessAlert } from '@/lib/utils';
import { DataTable } from '@/components/composite/table/data-table';
import { columns } from '@/components/composite/table/column';

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

  const handlePermissionsChange = (checked: boolean, key: string) =>
    setRolePermissions((prev) => {
      return {
        ...prev,
        [key]: checked
      };
    });

  const handleRoleCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await services.role.createOne({
        roleName,
        rolePermissions
      });
      setRoleName('');
      setRolePermissions(initialPermissions);
      showSuccessAlert('Role created successfully!');
    } catch (e) {
      console.error(e);
      showErrorAlert('Error creating Role!');
    }
  };

  React.useEffect(() => console.log(rolePermissions), [rolePermissions]);

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
            {['Create', 'Read', 'Update', 'Delete', 'Export', 'Import'].map(
              (permission) => (
                <div className="flex flex-col items-center space-y-2">
                  <Switch
                    id={permission}
                    onCheckedChange={(checked) =>
                      handlePermissionsChange(
                        checked,
                        `can_${permission.toLowerCase()}`
                      )
                    }
                  />
                  <Label className="text-xs" htmlFor={permission}>
                    {permission}
                  </Label>
                </div>
              )
            )}
          </div>
          <Button className="mt-8 w-full" type="submit">
            Create Role
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const AssignRole: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {};

    fetchUsers();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assign Role</CardTitle>
        {/* <CardDescription>
            Select Roles to assign to a particular user
          </CardDescription> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTable columns={columns} data={users} />
        <Button className="mt-8">Assign Role</Button>
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
