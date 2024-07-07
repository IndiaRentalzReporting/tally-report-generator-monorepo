import { Label } from '@radix-ui/react-label';
import React, { useState, FC, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
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

export const ForgotPassword: FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');

  const { mutateAsync: forgotPasswordMutation, isPending: loadingMutation } =
    useMutation({
      mutationFn: () => services.Authentication.forgot_password({ email }),
      onSuccess: (data) => {
        setEmail('');
        toast({
          variant: 'default',
          title: `Email Sent!`,
          description: data.data.message,
          action: <ToastAction altText="Okay!">Okay!</ToastAction>
        });
      }
    });

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPasswordMutation();
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your account email below to receive a link to reset your
            Password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              isLoading={loadingMutation}
            >
              Send Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
