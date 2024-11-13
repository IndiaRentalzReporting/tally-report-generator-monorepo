import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Skeleton } from '@trg_package/vite/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { services } from '@/services/Modules';
import Fields from './Fields';
import { SelectState, SelectFormSchema, FormState } from './interface';

const Edit: React.FC<Pick<SelectState, 'id'>> = ({ id }) => {
  const { data: moduleData, isFetching: loadingModule } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => SelectFormSchema.parse(data.data.modules[0]),
    queryKey: ['Modules', 'getOne', id]
  });

  const form = useForm<FormState>({
    resolver: zodResolver(SelectFormSchema),
    values: moduleData
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateModule, isPending: updatingModule } = useMutation({
    mutationFn: (moduleUpdate: Omit<FormState, 'id'>) => services.updateOne({ id }, moduleUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Modules', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['Modules', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    const { data: { module } } = await updateModule(values);
    form.resetField('name', { defaultValue: module.name });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <Skeleton isLoading={loadingModule}>
          <Fields form={form} />
          <Button type="submit" isLoading={updatingModule}>
            Update Module
          </Button>
        </Skeleton>
      </form>
    </Form>
  );
};

export default Edit;
