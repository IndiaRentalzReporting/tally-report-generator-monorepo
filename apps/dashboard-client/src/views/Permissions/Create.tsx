import { useQueryClient, useMutation } from '@tanstack/react-query';
import React from 'react';
import { Button, Form } from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Fields from './Fields';
import { FormState, InsertFormSchema, InsertState } from './interface';

const Create: React.FC = () => {
  const form = useForm<FormState>({
    resolver: zodResolver(z.object({ permissions: z.array(InsertFormSchema) })),
    defaultValues: {
      permissions: []
    }
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } = useMutation({
    mutationFn: async (values: InsertState) => {
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Permissions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Roles', 'getAll'] });
    }
  });

  const handleSubmit = (values: FormState) => {
    console.log(values);
    form.reset();
  };

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <Fields
          form={form}
        />
        <Button
          type="submit"
          className="w-min mt-2"
          isLoading={createPermissionLoading}
        >
          Create Permission
        </Button>
      </form>
    </Form>
  );
};

export default Create;
