import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Skeleton } from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useForm } from 'react-hook-form';
import { services } from '@/services/action';
import Fields from './Fields';
import { State, formSchema } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: actionData, isFetching: loadingAction } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => formSchema.parse(data.data.actions[0]),
    queryKey: ['actions', 'getOne', id]
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: actionData
  });

  const { mutateAsync: updateAction, isPending: updatingAction } = useMutation({
    mutationFn: (values: Omit<State, 'id'>) => services.updateOne({ id }, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['permissions', 'getAll'] });
    }
  });

  const handleSubmit = async (values: State) => {
    updateAction(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Skeleton isLoading={loadingAction}>
          <Fields form={form} />
        </Skeleton>
        <Button
          isLoading={updatingAction}
          type="submit"
          className="w-full mt-auto"
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

export default Update;
