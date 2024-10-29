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
import { State, formSchema } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const { data: userData, isFetching: loadingUser } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => formSchema
      .omit({ password: true })
      .parse(data.data.users[0]),
    queryKey: ['users', 'getOne', id]
  });

  const form = useForm<State>({
    resolver: zodResolver(formSchema.omit({ password: true })),
    values: userData ? {
      ...userData,
      password: '********'
    } : undefined
  });

  const queryClient = useQueryClient();
  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: () => services.updateOne({ id }, {
      ...userData,
      role_id: null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
    }
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: (updatedUser: Omit<State, 'id'>) => services.updateOne({ id }, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
    }
  });

  const handleSubmit = async (values: State) => {
    updateUser(values);
    form.reset();
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
