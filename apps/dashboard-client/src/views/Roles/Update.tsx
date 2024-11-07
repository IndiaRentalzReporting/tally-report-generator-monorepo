import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Form, Skeleton } from '@trg_package/vite/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { services } from '@/services/Roles';
import Fields from './Fields';
import { SelectState, SelectFormSchema, FormState } from './interface';

const Update: React.FC<Pick<SelectState, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: roleData, isFetching: loadingRole } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => SelectFormSchema.parse(data.data.roles[0]),
    queryKey: ['Roles', 'getOne', id]
  });

  const form = useForm<FormState>({
    resolver: zodResolver(SelectFormSchema),
    values: roleData
  });

  const { mutateAsync: updateRole, isPending: updatingRole } = useMutation({
    mutationFn: (roleUpdate: Omit<SelectState, 'id'>) => services.updateOne({ id }, roleUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Roles', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    const { data: { role } } = await updateRole(values);
    form.resetField('name', { defaultValue: role.name });
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
