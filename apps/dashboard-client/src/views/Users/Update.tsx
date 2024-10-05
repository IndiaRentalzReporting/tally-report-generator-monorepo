import React, {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import {
  Button, Input, Label, Skeleton
} from '@trg_package/components';
import { services } from '@/services/user';
import Fields from './Fields';
import { State, initialState } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const [updatedUser, setUpdatedUser] = useState<State>(initialState);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  const { data: userData, isFetching: loadingUser } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => data.data.users[0],
    queryKey: ['users', 'getOne', id]
  });

  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: () => services.updateOne(id, {
      ...userData,
      role_id: null
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
    }
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: () => services.updateOne(id, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'getOne', id] });
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
    }
  });

  useEffect(() => {
    if (!userData) return;
    setUpdatedUser({ ...userData, password: '' });
  }, [userData]);

  const handleUserUpdate: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    updateUser();
  };

  const handleUserDataChange: Dispatch<SetStateAction<State>> = (newState) => {
    if (!dataUpdated) setDataUpdated(true);
    setUpdatedUser(newState);
  };

  return (
    <form onSubmit={handleUserUpdate} className="grid gap-4">
      <Skeleton isLoading={loadingUser}>
        <Fields userData={updatedUser} setUserData={handleUserDataChange} />
      </Skeleton>
      <div className="flex items-center gap-2">
        <Label htmlFor="role">Role</Label>
        <Input
          disabled
          id="role"
          name="role"
          value={userData?.role?.name}
          placeholder="--"
          required
        />
        <TrashIcon
          className="text-red-500 cursor-pointer"
          onClick={() => deleteRole()}
        />
      </div>
      <Button
        type="submit"
        disabled={!dataUpdated}
        onClick={() => updateUser()}
      >
        Update
      </Button>
    </form>
  );
};

export default Update;
