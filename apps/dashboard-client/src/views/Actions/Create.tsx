import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Form } from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/action';
import Fields from './Fields';
import { defaultValues, formSchema, State } from './interface';

const Create: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createAction, isPending: loadingCreateAction } = useMutation({
    mutationFn: (actionData: Omit<State, 'id'>) => services.createOne(actionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['permissions', 'getAll'] });
    }
  });

  const handleSubmit = async (values: State) => {
    createAction(values);
    form.reset();
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
