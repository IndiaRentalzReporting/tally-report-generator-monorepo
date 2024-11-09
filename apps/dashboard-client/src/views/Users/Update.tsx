import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Skeleton
} from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/Users';
import Fields from './Fields';
import { SelectState, SelectFormSchema, FormState } from './interface';

const Update: React.FC<Pick<SelectState, 'id'>> = ({ id }) => {
  const { data: userData, isFetching: loadingUser } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => SelectFormSchema.parse({ ...data.data.users[0], password: '********' }),
    queryKey: ['Users', 'getOne', id]
  });

  const form = useForm<FormState>({
    resolver: zodResolver(SelectFormSchema),
    values: userData
  });

  const queryClient = useQueryClient();
  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: () => services.updateOne({ id }, {
      ...userData,
      role_id: null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Users', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['Users', 'getAll'] });
    }
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: (userUpdate: Omit<SelectState, 'id'>) => services.updateOne({ id }, userUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Users', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['Users', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    const { data: { user } } = await updateUser(values);
    form.resetField('first_name', { defaultValue: user.first_name });
    form.resetField('last_name', { defaultValue: user.last_name });
    form.resetField('email', { defaultValue: user.email });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <Skeleton isLoading={loadingUser}>
          <Fields form={form} />
        </Skeleton>
        <FormField
          control={form.control}
          name="role.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel >Role</FormLabel>
              <FormControl>
                <div className='flex gap-2 items-center'>
                  <Input
                    disabled
                    type='text'
                    placeholder="--"
                    {...field}
                  />
                  <TrashIcon
                    className="text-red-500 cursor-pointer"
                    onClick={() => deleteRole()}
                  />
                </div>
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

export default Update;
