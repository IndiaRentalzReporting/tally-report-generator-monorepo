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
  DataTable,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form
} from '@trg_package/vite/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { services as userServices } from '@/services/Users';
import { services as roleServices } from '@/services/Roles';
import { useIsAllowed } from '@/hooks';
import { columns } from './columns';
import { SelectFormSchema as UserSelectFormSchema } from './interface';
import { InsertFormSchema, SelectFormSchema as RoleSelectFormSchema } from '../Roles/interface';

const formSchema = InsertFormSchema.pick({ id: true });
type FormState = z.infer<typeof formSchema>;

const Read: React.FC = () => {
  const form = useForm<FormState>({
    resolver: zodResolver(formSchema),
  });

  const isUpdateAllowed = useIsAllowed({
    module: 'Users',
    action: 'Update'
  });

  const isReadAllowed = useIsAllowed({
    module: 'Users',
    action: 'Read'
  });

  const [rowSelection, setRowSelection] = React.useState({});

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => userServices.read(),
    select: (data) => data.data.users.map((user) => UserSelectFormSchema.parse({ ...user, password: '********' })),
    queryKey: ['users', 'getAll']
  });

  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: async () => roleServices.read(),
    select: (data) => data.data.roles.map((role) => RoleSelectFormSchema.parse(role)),
    queryKey: ['roles', 'getAll']
  });

  const queryClient = useQueryClient();
  const { mutateAsync: assignRoleMutation, isPending: assignRoleLoading } = useMutation({
    mutationFn: (values: FormState) => {
      const keys = Object.keys(rowSelection);
      const selectedUsers = allUsers
        ?.map((user, index) => (keys.includes(String(index)) ? user.id : ''))
        .filter((id) => !!id) ?? [];
      const promises = selectedUsers.map(async (id) => userServices.updateOne(
        { id },
        { role_id: values.id }
      ));
      return Promise.all(promises);
    },
    onSettled() {
      setRowSelection({});
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    assignRoleMutation(values);
    form.resetField('id', { defaultValue: '' });
  };

  return (
    <When condition={isReadAllowed}>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Read, Update or Delete users based on your permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <When condition={isUpdateAllowed}>
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className='flex-grow'>
                      <FormLabel>Base Entity</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
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
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </Form>
        </CardContent>
      </Card>
    </When>
  );
};

export default Read;
