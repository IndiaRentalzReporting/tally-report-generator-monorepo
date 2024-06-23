import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui';
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
    mutationFn: (data: RegisterUser) => services.auth.signUp(data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] });
      setLoading(false);
      navigate('/sign-in');
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Users</CardTitle>
        <CardDescription>
          Enter information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="grid gap-4">
          <Fields userData={registerData} setUserData={setRegisterData} />
          <Button type="submit" className="w-min" isLoading={loading}>
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Create;
