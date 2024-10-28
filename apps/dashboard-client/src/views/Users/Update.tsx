import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import {
  Button, Form, Input, Label, Skeleton
} from '@trg_package/vite/components';
import { schema } from '@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/user';
import Fields from './Fields';
import { State, formSchema } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const { data: userData, isFetching: loadingUser } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => formSchema.parse(data.data.users[0]),
    queryKey: ['users', 'getOne', id]
  });

  if (!userData) throw new Error('User data is undefined');

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: userData
  });

  const queryClient = useQueryClient();
  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: () => services.updateOne(id, {
      ...userData,
      role_id: null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
    }
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: (updatedUser: Omit<State, 'id'>) => services.updateOne(id, updatedUser),
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
        <div className="flex items-center gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            disabled
            id="role"
            name="role"
            value={userData?.role?.name}
            placeholder="--"
            required
          />
          <TrashIcon
            className="text-red-500 cursor-pointer"
            onClick={() => deleteRole()}
          />
        </div>
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
