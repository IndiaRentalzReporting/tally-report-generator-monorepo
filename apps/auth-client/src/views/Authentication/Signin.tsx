import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from '@trg_package/vite/components';
import { UserSelectSchema } from '@trg_package/schemas-auth/types';
import { useAuth } from '@trg_package/vite/providers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = UserSelectSchema.pick({
  email: true,
  password: true
});
type State = z.infer<typeof formSchema>;

export const SignInForm = () => {
  const {
    signIn: { mutation: signIn, isLoading }
  } = useAuth();

  const form = useForm<State>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleSubmit = async (values: State) => {
    signIn(values);
    form.reset();
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
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-2">
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
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center'>
                        <span>Password</span>
                        <Link
                          className="ml-auto inline-block text-sm underline"
                          to="/forgot-password"
                        >
                          Forgot your password?
                        </Link>
                      </FormLabel>
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
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
