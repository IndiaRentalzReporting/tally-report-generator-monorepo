import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label
} from '@/components/ui';
import { RegisterUser } from '@/models';
import services from '@/services';

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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                name="first_name"
                value={registerData.first_name}
                onChange={handleFormChange}
                placeholder="Max"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                name="last_name"
                value={registerData.last_name}
                onChange={handleFormChange}
                placeholder="Robinson"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleFormChange}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              value={registerData.password}
              onChange={handleFormChange}
              placeholder="**********"
              type="password"
            />
          </div>
          <Button type="submit" className="w-min" isLoading={loading}>
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Create;
