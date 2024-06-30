import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Role } from '@/models';
import services from '@/services';
import Fields from './Fields';
import { Button } from '@/components/ui';

type State = Pick<Role, 'name'>;

const initialState: State = {
  name: ''
};

const Update: React.FC<{ id: string }> = ({ id }) => {
  const [roleData, setRoleData] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { data: roleDataX, isFetching } = useQuery({
    queryFn: () => services.Roles.getOne(id),
    select: (data) => data.data.role,
    queryKey: ['roles', 'getOne', id]
  });

  useEffect(() => {
    if (!roleDataX) return;
    setRoleData(roleDataX);
  }, [roleDataX]);

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
      <Button type="submit" className="w-full mt-auto">
        Create
      </Button>
    </form>
  );
};

export default Update;
