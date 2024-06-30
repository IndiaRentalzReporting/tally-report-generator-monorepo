import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Role } from '@/models';
import services from '@/services';
import Fields from './Fields';
import { Button } from '@/components/ui';
import { State, initialState } from './interface';

const Create: React.FC = () => {
  const [roleData, setRoleData] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: createRole, isPending: loadingCreateRole } = useMutation(
    {
      mutationFn: () => services.Roles.createOneX(roleData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles', 'getAll'] });
      },
      onSettled: () => {
        setRoleData(initialState);
      }
    }
  );

  const handleCreateRole: React.FormEventHandler = (e) => {
    e.preventDefault();
    createRole();
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleCreateRole}>
      <Fields roleData={roleData} setRoleData={setRoleData} />
      <Button
        type="submit"
        isLoading={loadingCreateRole}
        className="w-full mt-auto"
      >
        Create
      </Button>
    </form>
  );
};

export default Create;
