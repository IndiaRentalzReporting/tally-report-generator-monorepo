import { Label } from '@radix-ui/react-label';
import React, { useState, FC, FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  ToastAction
} from '@/components/ui';
import services from '@/services';
import { useToast } from '@/lib/hooks';

export const ResetPassword: FC = () => {
  const { token: unvalidatedToken } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // const { data: token = '' } = useQuery({
  //   queryFn: () =>
  //     services.Authentication.check_reset_password(unvalidatedToken ?? ''),
  //   select: (data) => data.data.token,
  //   queryKey: ['reset token', 'validation']
  // });

  const { mutateAsync: forgotPasswordMutation, isPending: loadingMutation } =
    useMutation({
      mutationFn: () =>
        services.Authentication.reset_password({
          token: unvalidatedToken ?? '',
          password,
          confirmPassword
        }),
      onSuccess: (data) => {
        setPassword('');
        setConfirmPassword('');
        toast({
          variant: 'default',
          title: `Password Reset!`,
          description: data.data.message,
          action: <ToastAction altText="Okay!">Okay!</ToastAction>
        });
      }
    });

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPasswordMutation();
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new Password. Please create a strong password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <Input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*********"
                required
              />
              <Label htmlFor="email">ConfirmPassword</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="*********"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              isLoading={loadingMutation}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
