import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { RegisterUser } from '@/models';
import services from '@/services';
import Fields from './Fields';

const Create: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState<RegisterUser>({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });

  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: (data: RegisterUser) => services.Authentication.signUp(data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
      setLoading(false);
      setRegisterData({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      });
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
    setLoading(true);
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
