import { Link } from 'react-router-dom';
import { ChangeEvent, useState, FormEvent } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label
} from '@trg_package/components';
import { LoginUser } from '@trg_package/schemas-auth/types';
import { useAuth } from '@trg_package/providers';

export function SigninForm() {
  const {
    signIn: { mutation: signIn, isLoading }
  } = useAuth();

  const [loginData, setLoginData] = useState<LoginUser>({
    email: '',
    password: ''
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(loginData);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSignIn}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                onChange={handleFormChange}
                placeholder="m@example.com"
                required
                type="email"
                value={loginData.email}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="ml-auto inline-block text-sm underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                onChange={handleFormChange}
                placeholder="********"
                required
                type="password"
                value={loginData.password}
              />
            </div>
            <Button className="w-full" isLoading={isLoading} type="submit">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link className="underline" to="/sign-up">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
