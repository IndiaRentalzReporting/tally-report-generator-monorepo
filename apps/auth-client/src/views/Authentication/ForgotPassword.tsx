import { Label } from '@trg_package/components';
import { useState, FC, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  ToastAction,
  useToast
} from '@trg_package/components';
import { services } from './services';

export const ForgotPassword: FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');

  const { mutateAsync: forgotPasswordMutation, isPending: loadingMutation } =
    useMutation({
      mutationFn: () => services.forgotPassword({ email }),
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
          <form className="grid gap-4" onSubmit={handleForgotPassword}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
                type="email"
                value={email}
              />
            </div>
            <Button
              className="w-full"
              isLoading={loadingMutation}
              type="submit"
            >
              Send Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
