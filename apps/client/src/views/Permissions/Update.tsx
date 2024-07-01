import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import services from '@/services';
import Fields from './Fields';
import { Button, Skeleton } from '@/components/ui';
import { State, initialState } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const [roleData, setRoleData] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { data: roleDataX, isFetching: loadingRole } = useQuery({
    queryFn: () => services.Roles.getOne(id),
    select: (data) => data.data.role,
    queryKey: ['roles', 'getOne', id]
  });

  useEffect(() => {
    if (!roleDataX) return;
    setRoleData(roleDataX);
  }, [roleDataX]);

  const { mutateAsync: createRole, isPending: updatingRole } = useMutation({
    mutationFn: () => services.Roles.updateOneX(id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', 'getAll'] });
    },
    onSettled: () => {
      setRoleData(initialState);
    }
  });

  const handleCreateRole: React.FormEventHandler = (e) => {
    e.preventDefault();
    createRole();
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleCreateRole}>
      <Skeleton isLoading={loadingRole}>
        <Fields roleData={roleData} setRoleData={setRoleData} />
      </Skeleton>
      <Button isLoading={updatingRole} type="submit" className="w-full mt-auto">
        Create
      </Button>
    </form>
  );
};

export default Update;
