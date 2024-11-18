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
import { TenantInsertSchema, UserSelectSchema } from '@trg_package/schemas-auth/types';
import { UserSelectSchema as DashboardUserSelectSchema } from '@trg_package/schemas-dashboard/types';
import { useAuth } from '@trg_package/vite/providers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = UserSelectSchema.pick({
  email: true,
  password: true,
}).extend({
  tenant: TenantInsertSchema.shape.name,
  first_name: DashboardUserSelectSchema.shape.first_name,
  last_name: DashboardUserSelectSchema.shape.last_name
});

type State = z.infer<typeof formSchema>;

export const SignUpForm = () => {
  const {
    onboard: { isLoading, mutation: onboard },
  } = useAuth();

  const form = useForm<State>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      tenant: ''
    }
  });

  const handleSubmit = async ({ tenant: name, ...user }: State) => {
    onboard({
      tenant: {
        name
      },
      user
    });
    form.reset();
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="tenant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Company Name</FormLabel>
                      <FormControl>
                      <Input
                          placeholder="IXC Pvt Ltd."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >First Name</FormLabel>
                        <FormControl>
                        <Input
                            placeholder="Max"
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
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >Last Name</FormLabel>
                        <FormControl>
                        <Input
                            placeholder="Smith"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
                      <FormLabel className='flex items-center'>Password</FormLabel>
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
                Create an Account
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link className="underline" to="/sign-in">
                Sign in
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
