import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { RegisterUser } from '@/models';
import services from '@/services';
import Fields from './Fields';
import { State, initialState } from './interface';

const Create: React.FC = () => {
  const queryClient = useQueryClient();

  const [registerData, setRegisterData] = useState<State>(initialState);

  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: (data: RegisterUser) => services.Authentication.signUp(data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
      setRegisterData(initialState);
    }
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation(registerData);
  };

  return (
    <form className="h-full flex flex-col gap-4" onSubmit={handleSignUp}>
      <Fields userData={registerData} setUserData={setRegisterData} />
      <Button type="submit" className="w-full mt-auto">
        Create
      </Button>
    </form>
  );
};

export default Create;
