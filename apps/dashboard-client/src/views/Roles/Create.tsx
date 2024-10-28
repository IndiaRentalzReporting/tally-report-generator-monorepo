import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Form } from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/role';
import Fields from './Fields';
import { State, defaultValues } from './interface';
import { formSchema } from '../Actions/interface';

const Create: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createRole, isPending: loadingCreateRole } = useMutation(
    {
      mutationFn: (roleData: Omit<State, 'id'>) => services.createOne(roleData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles', 'getAll'] });
      }
    }
  );

  const handleSubmit = (values: State) => {
    createRole(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Fields form={form} />
        <Button
          type="submit"
          isLoading={loadingCreateRole}
          className="w-full mt-auto"
        >
          Create
        </Button>
      </form>
    </Form>
  );
};

export default Create;
