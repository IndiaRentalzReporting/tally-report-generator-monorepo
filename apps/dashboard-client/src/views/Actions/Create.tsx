import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Form } from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/Actions';
import Fields from './Fields';
import { FormState, InsertFormSchema, InsertState } from './interface';

const Create: React.FC = () => {
  const form = useForm<FormState>({
    resolver: zodResolver(InsertFormSchema),
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createAction, isPending: loadingCreateAction } = useMutation({
    mutationFn: (actionData: Omit<InsertState, 'id'>) => services.createOne(actionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Permissions', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    createAction(values);
    form.resetField('name', { defaultValue: '' });
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Fields form={form} />
        <Button
          type="submit"
          isLoading={loadingCreateAction}
          className="w-full mt-auto"
        >
          Create
        </Button>
      </form>
    </Form>
  );
};

export default Create;
