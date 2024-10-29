import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Skeleton } from '@trg_package/vite/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Fields from './Fields';
import { services } from '@/services/Modules';
import { State, formSchema } from './interface';

const Edit: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const { data: moduleData, isFetching: loadingModule } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => formSchema.parse(data.data.modules[0]),
    queryKey: ['getOne', 'modules', id]
  });

  const form = useForm<State>({
    resolver: zodResolver(formSchema),
    values: moduleData
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateModule, isPending: updatingModule } = useMutation({
    mutationFn: (moduleDetails: Omit<State, 'id'>) => services.updateOne({ id }, moduleDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
    }
  });

  const handleSubmit = async (values: State) => {
    updateModule(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <Skeleton isLoading={loadingModule}>
          <Fields form={form} />
        </Skeleton>
        <Button type="submit" isLoading={updatingModule}>
          Update Module
        </Button>
      </form>
    </Form>
  );
};

export default Edit;
