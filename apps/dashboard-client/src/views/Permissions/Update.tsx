import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import {
  PermissionSelect
} from '@trg_package/schemas-dashboard/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { services as permissionService } from '@/services/Permissions';
import Fields from './Fields';
import { FormState, SelectFormSchema, SelectState } from './interface';

const Update: React.FC<Pick<PermissionSelect, 'id'>> = ({ id }) => {
  const { data: permissions = [], isFetching: loadingPermissions } = useQuery({
    queryFn: () => permissionService.read({ role_id: id }),
    select: (data) => data.data.permissions
      .map((permission) => SelectFormSchema.parse({
        ...permission,
        permissionAction: permission.permissionAction.map(
          (pa) => ({ action: { ...pa.action, checked: true } })
        )
      })),
    queryKey: ['Roles', 'getOne', id],
  });

  const form = useForm<FormState>({
    resolver: zodResolver(z.object({ permissions: z.array(SelectFormSchema) })),
    values: {
      permissions
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'permissions'
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } = useMutation({
    mutationFn: async (values: SelectState) => {
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Permission', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getAll'] });
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
                  disabled
                  defaultValue={permissions[0]?.role.id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <Skeleton isLoading={loadingPermissions}>
                      <SelectItem value={permissions[0]?.role.id ?? ''}>
                        {permissions[0]?.role.name}
                      </SelectItem>
                    </Skeleton>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Skeleton isLoading={loadingPermissions}>
          <Fields
            form={form}
            fields={fields}
          />
          <Button
            type="submit"
            className="w-min mt-2"
            isLoading={createPermissionLoading}
          >
            Update Permission
          </Button>
        </Skeleton>
      </form>
    </Form>
  );
};

export default Update;
