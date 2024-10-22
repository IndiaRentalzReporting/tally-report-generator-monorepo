import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  ToastAction,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@trg_package/vite/components';
import { useToast } from '@trg_package/vite/hooks';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSelectSchema } from '@trg_package/schemas-auth/types';
import * as z from 'zod';
import { services } from './services';

const formSchema = UserSelectSchema.pick({ email: true });

export const ForgotPassword: FC = () => {
  const { toast } = useToast();

  const { mutateAsync: forgotPasswordMutation, isPending: loadingMutation } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => services.forgotPassword(values),
    onSuccess: (data) => {
      toast({
        variant: 'default',
        title: 'Email Sent!',
        description: data.data.message,
        action: <ToastAction altText="Okay!">Okay!</ToastAction>
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    forgotPasswordMutation(values);
    form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel >Email</FormLabel>
                <FormControl>
                <Input
                    type='email'
                    placeholder="m@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
              className="w-full mt-2"
              isLoading={loadingMutation}
              type="submit"
            >
              Send Email
            </Button>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  );
};
