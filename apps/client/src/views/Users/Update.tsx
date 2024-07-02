import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { Button, Input, Label, Skeleton } from '@/components/ui';
import services from '@/services';
import Fields from './Fields';
import { State, initialState } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const [updatedUser, setUpdatedUser] = useState<State>(initialState);

  const { data: userData, isFetching: loadingUser } = useQuery({
    queryFn: () => services.Users.getOne(id),
    select: (data) => data.data.user,
    queryKey: ['getOne', 'users', id]
  });

  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: () =>
      services.Users.updateOne(userData?.id, {
        ...userData,
        role_id: null
      })
  });

  useEffect(() => {
    if (!userData) return;
    setUpdatedUser({ ...userData, password: '' });
  }, [userData]);

  return (
    <form
      // onSubmit={handleSignUp}
      className="grid gap-4"
    >
      <Skeleton isLoading={loadingUser}>
        <Fields userData={updatedUser} setUserData={setUpdatedUser} />
      </Skeleton>
      <div className="flex items-center gap-2">
        <Label htmlFor="role">Role</Label>
        <Input
          disabled
          id="role"
          name="role"
          value={userData?.role?.name}
          placeholder="Role"
          required
        />
        <TrashIcon
          className="text-red-500 cursor-pointer"
          onClick={() => deleteRole()}
        />
      </div>
      <Button type="submit">Update</Button>
    </form>
  );
};

export default Update;
