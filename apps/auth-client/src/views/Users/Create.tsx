import React, { FormEvent, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { RegisterUser } from '@/models';
import { services } from './services';
import Fields from './Fields';
import { State, initialState } from './interface';

const Create: React.FC = () => {
  const [userData, setUserData] = useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: (data: RegisterUser) => services.createOne(data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
      setUserData(initialState);
    }
  });

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation(userData);
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
