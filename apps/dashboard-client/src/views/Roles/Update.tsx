import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Form, Skeleton } from '@trg_package/vite/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { services } from '@/services/Roles';
import Fields from './Fields';
import { State, formSchema } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: roleData, isFetching: loadingRole } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => formSchema.parse(data.data.roles[0]),
    queryKey: ['roles', 'getOne', id]
  });

  const form = useForm<State>({
    resolver: zodResolver(formSchema),
    values: roleData
  });

  const { mutateAsync: updateRole, isPending: updatingRole } = useMutation({
    mutationFn: (roleData: Omit<State, 'id'>) => services.updateOne({ id }, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', 'getAll'] });
    }
  });

  const handleSubmit = (values: State) => {
    updateRole(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Skeleton isLoading={loadingRole}>
          <Fields form={form} />
        </Skeleton>
        <Button isLoading={updatingRole} type="submit" className="w-full mt-auto">
          Update
        </Button>
      </form>
    </Form>
  );
};

export default Update;
