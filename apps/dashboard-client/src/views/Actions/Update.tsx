// Update.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Skeleton, Form } from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/Actions';
import Fields from './Fields';
import { SelectState, SelectFormSchema, FormState } from './interface';

const Update: React.FC<Pick<SelectState, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: actionData, isFetching: loadingAction } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => SelectFormSchema.parse(data.data.actions[0]),
    queryKey: ['Actions', 'getOne', id]
  });

  const form = useForm<FormState>({
    resolver: zodResolver(SelectFormSchema),
    values: actionData
  });

  const { mutateAsync: updateAction, isPending: updatingAction } = useMutation({
    mutationFn: (actionUpdate: Omit<FormState, 'id'>) => services.updateOne({ id }, actionUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Permissions', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    const { data: { action } } = await updateAction(values);
    form.resetField('name', { defaultValue: action.name });
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Skeleton isLoading={loadingAction}>
          <Fields form={form} />
          <Button
            isLoading={updatingAction}
            type="submit"
            className="w-full mt-auto"
          >
            Update
          </Button>
        </Skeleton>
      </form>
    </Form>
  );
};

export default Update;
