import {
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  ToastAction,
  If,
  Then,
  Else,
  useToast
} from '@trg_package/components';
import { useState, FC, FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { services } from './services';

export const ResetPassword: FC = () => {
  const { token: unvalidatedToken } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const { data: token, isError } = useQuery({
    queryFn: () => services.checkResetPassword(unvalidatedToken ?? ''),
    select: (data) => data.data,
    queryKey: ['reset token', 'validation']
  });

  const { mutateAsync: forgotPasswordMutation, isPending: loadingMutation } = useMutation({
    mutationFn: () => services.resetPassword({
      token: token?.token ?? '',
      password,
      confirmPassword
    }),
    onSuccess: (data) => {
      setPassword('');
      setConfirmPassword('');
      toast({
        variant: 'default',
        title: 'Password Reset!',
        description: data.data.message,
        action: (
            <ToastAction altText="Okay!" onClick={() => navigate('/sign-in')}>
              Okay!
            </ToastAction>
        )
      });
    }
  });

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPasswordMutation();
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <If condition={isError}>
        <Then>
          <Navigate to="/sign-in" />
        </Then>
        <Else>
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your new Password. Please create a strong password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleResetPassword}>
                <div className="grid gap-2">
                  <Label htmlFor="email">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*********"
                    required
                    type="password"
                    value={password}
                  />
                  <Label htmlFor="email">ConfirmPassword</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="*********"
                    required
                    type="password"
                    value={confirmPassword}
                  />
                </div>
                <Button
                  className="w-full"
                  isLoading={loadingMutation}
                  type="submit"
                >
                  Reset Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </Else>
      </If>
    </div>
  );
};
