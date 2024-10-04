import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Button, Skeleton } from '@trg_package/components';
import { services } from '@/services/role';
import Fields from './Fields';
import { State, initialState } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const [roleData, setRoleData] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { data: roleDataX, isFetching: loadingRole } = useQuery({
    queryFn: () => services.getOne(id),
    select: (data) => data.data.role,
    queryKey: ['roles', 'getOne', id]
  });

  useEffect(() => {
    if (!roleDataX) return;
    setRoleData(roleDataX);
  }, [roleDataX]);

  const { mutateAsync: updateRole, isPending: updatingRole } = useMutation({
    mutationFn: () => services.updateOneX(id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', 'getAll'] });
    },
    onSettled: () => {
      setRoleData(initialState);
    }
  });

  const handleUpdateRole: React.FormEventHandler = (e) => {
    e.preventDefault();
    updateRole();
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleUpdateRole}>
      <Skeleton isLoading={loadingRole}>
        <Fields roleData={roleData} setRoleData={setRoleData} />
      </Skeleton>
      <Button isLoading={updatingRole} type="submit" className="w-full mt-auto">
        Update
      </Button>
    </form>
  );
};

export default Update;
