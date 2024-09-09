import React, { FormEvent, useState } from 'react';
import { Button } from '@trg_package/components';
import Fields from './Fields';
import { State, initialState } from './interface';
import { useAuth } from '@/providers/AuthProvider';

const Create: React.FC = () => {
  const { signUp } = useAuth();
  const [userData, setUserData] = useState<State>(initialState);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(userData);
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleSignUp}>
      <Fields userData={userData} setUserData={setUserData} />
      <Button type="submit" className="w-full mt-auto">
        Create
      </Button>
    </form>
  );
};

export default Create;
