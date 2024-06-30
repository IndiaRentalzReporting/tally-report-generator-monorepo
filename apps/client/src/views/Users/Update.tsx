import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton } from '@/components/ui';
import services from '@/services';
import Fields from './Fields';
import { State, initialState } from './interface';

const Update: React.FC<Pick<State, 'id'>> = ({ id }) => {
  const [registerData, setRegisterData] = useState<State>(initialState);

  const { data: userData, isFetching: loadingUser } = useQuery({
    queryFn: () => services.Users.getOne(id),
    select: (data) => data.data.user,
    queryKey: ['getOne', 'users', id]
  });

  useEffect(() => {
    if (!userData) return;
    setRegisterData({ ...userData, password: '' });
  }, [userData]);

  return (
    <form
      // onSubmit={handleSignUp}
      className="grid gap-4"
    >
      <Skeleton isLoading={loadingUser}>
        <Fields userData={registerData} setUserData={setRegisterData} />
      </Skeleton>
      <Button type="submit">Update</Button>
    </form>
  );
};

export default Update;
