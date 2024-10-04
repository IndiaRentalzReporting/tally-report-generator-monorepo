import React, { FormEvent, useState } from 'react';
import { Button } from '@trg_package/components';
import { useAuth } from '@trg_package/providers';
import Fields from './Fields';
import { State, initialState } from './interface';

const Create: React.FC = () => {
  const {
    signUp: { mutation: signUp, isLoading }
  } = useAuth();
  const [userData, setUserData] = useState<State>(initialState);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(userData);
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleSignUp}>
      <Fields userData={userData} setUserData={setUserData} />
      <Button isLoading={isLoading} type="submit" className="w-full mt-auto">
        Create
      </Button>
    </form>
  );
};

export default Create;
