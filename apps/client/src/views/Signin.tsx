import { Link } from 'react-router-dom';
import { ChangeEvent, useState, FormEvent } from 'react';
import { LoginUser } from '@fullstack_package/interfaces';
import clsx from 'clsx';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  LoadingSpinner
} from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { Else, If, Then } from '@/components/utility';

export const SigninForm = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    if (signIn)
      signIn(loginData, {
        onSettled(d, e, v, c) {
          setLoading(false);
        }
      });
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
          <form onSubmit={handleSignIn} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleFormChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleFormChange}
                required
              />
            </div>
            <Button
              type="submit"
              className={clsx(
                loading && 'cursor-default pointer-events-none',
                'w-full'
              )}
            >
              <If condition={loading}>
                <Then>
                  <LoadingSpinner />
                </Then>
                <Else>Login</Else>
              </If>
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
