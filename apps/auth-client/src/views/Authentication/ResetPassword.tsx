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
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  When
} from '@trg_package/vite/components';
import { useToast } from '@trg_package/vite/hooks';
import { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { UserSelectSchema } from '@trg_package/schemas-auth/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { services } from '@/services';

const formSchema = UserSelectSchema.pick({ password: true }).extend({
  confirmPassword: UserSelectSchema.shape.password
});

type State = z.infer<typeof formSchema>;

export const ResetPassword: FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isSuccess } = useQuery({
    queryFn: () => services.checkResetPassword(token ?? ''),
    select: (data) => data.data,
    queryKey: ['reset token', 'validation']
  });

  const form = useForm<State>({
    resolver: zodResolver(formSchema)
  });

  const { mutateAsync: forgotPasswordMutation, isPending: loadingMutation } = useMutation({
    mutationFn: (values: State) => services.resetPassword({
      token: token ?? '',
      ...values
    }),
    onSuccess: (data) => {
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

  const handleSubmit = async (values: State) => {
    // invalidate jwt token
    forgotPasswordMutation(values);
    form.reset();
  };

  const queryClient = useQueryClient();
  const handleSkipResetPassword = async () => {
    // invalidate jwt token
    queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <When condition={isSuccess}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your new Password. Please create a strong password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >Password</FormLabel>
                        <FormControl>
                          <Input
                              type='password'
                              placeholder="********"
                              {...field}
                            />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                              type='password'
                              placeholder="********"
                              {...field}
                            />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  className="w-full"
                  isLoading={loadingMutation}
                  type="submit"
                >
                  Reset Password
                </Button>
                {/* <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleSkipResetPassword}
                  type="button"
                >
                  Skip
                </Button> */}
              </form>
            </Form>
          </CardContent>
        </Card>
      </When>
    </div>
  );
};
