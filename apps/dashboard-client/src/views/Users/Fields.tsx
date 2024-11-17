import React from 'react';
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { FormState, StateAsProps } from './interface';
import { services as roleServices } from '@/services/Roles';
import { SelectFormSchema as RoleSelectFormSchema } from '../Roles/interface';

const Fields: React.FC<StateAsProps> = ({ form }) => {
  const { data: allRoles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: async () => roleServices.read(),
    select: (data) => data.data.roles.map((role) => RoleSelectFormSchema.parse(role)),
    queryKey: ['Roles', 'getAll']
  });

  const queryClient = useQueryClient();
  const { mutateAsync: assignRoleMutation, isPending: assignRoleLoading } = useMutation({
    mutationFn: (values: FormState) => {
      throw new Error('Not implemented');
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['Users', 'getAll'] });
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full gap-4 items-center">
        <div className="flex-grow">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel >First Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder="Max"
                    {...field}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-grow">
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel >Last Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder="Robinson"
                    {...field}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel >Email</FormLabel>
            <FormControl>
              <Input
                type='email'
                placeholder="m@example.com"
                {...field}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel >Password</FormLabel>
            <FormControl>
              <Input
                type='password'
                placeholder="********"
                {...field}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role_id"
        render={({ field }) => (
          <FormItem className='flex-grow'>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Select
                {...field}
                value={field.value ?? undefined}
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
    </div>
  );
};

export default Fields;
