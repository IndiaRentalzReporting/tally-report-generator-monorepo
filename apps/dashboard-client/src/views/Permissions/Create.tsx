import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { services as roleService } from '@/services/Roles';
import { services as moduleService } from '@/services/Modules';
import { services as actionService } from '@/services/Actions';
import { FormState, InsertFormSchema, InsertState } from './interface';
import Fields from './Fields';

const Create: React.FC = () => {
  const { data: roles = [], isFetching: fetchingRoles } = useQuery({
    queryFn: async () => roleService.read(),
    select: (data) => data.data.roles.filter((role) => !role.permission.length),
    queryKey: ['Roles', 'getAll']
  });

  const { data: actions = [], isFetching: fetchingActions } = useQuery({
    queryFn: () => actionService.read(),
    select: (data) => data.data.actions,
    queryKey: ['Actions', 'getAll']
  });

  const { data: modules = [], isFetching: fetchingModules } = useQuery({
    queryFn: () => moduleService.read(),
    select: (data) => data.data.modules,
    queryKey: ['Modules', 'getAll']
  });

  const form = useForm<FormState>({
    resolver: zodResolver(z.object({ permissions: z.array(InsertFormSchema) })),
    values: {
      permissions: modules.map((module) => ({
        module: {
          id: module.id,
          name: module.name
        },
        permissionAction: actions.map(({ id, name }) => ({
          action: {
            id,
            name,
            checked: false,
          }
        }))
      }))
    }
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'permissions'
  });

  const handleRoleChange = (newRoleId: string) => {
    const selectedRole = roles.find((role) => role.id === newRoleId);
    if (!selectedRole) return;

    const values = fields.map((permission) => ({
      ...permission,
      role: {
        id: selectedRole.id,
        name: selectedRole.name
      }
    }));

    replace(values);
  };

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } = useMutation({
    mutationFn: async (values: InsertState) => {
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Permissions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Roles', 'getAll'] });
    }
  });

  const handleSubmit = (values: FormState) => {
    console.log(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="permissions.0.role.id"
          render={({ field }) => (
            <FormItem className='flex-grow'>
              <FormLabel>Base Entity</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <Skeleton isLoading={fetchingRoles}>
                        {roles.map((role) => (
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
        <Skeleton isLoading={fetchingActions || fetchingModules || fetchingRoles}>
          <Fields
            form={form}
            fields={fields}
            />
          <Button
            type="submit"
            className="w-min mt-2"
            isLoading={createPermissionLoading}
            >
            Create Permission
          </Button>
        </Skeleton>
      </form>
    </Form>
  );
};

export default Create;
