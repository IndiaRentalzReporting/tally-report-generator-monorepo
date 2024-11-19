import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { UserSelectSchema } from '@trg_package/schemas-auth/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@trg_package/vite/providers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormControl,
  Input,
  FormDescription,
  FormMessage,
  DialogFooter,
  Button
} from '@trg_package/vite/components';
import { services as userServices } from '@/services/Users';

const formSchema = UserSelectSchema.pick({ password: true }).extend({
  confirmPassword: UserSelectSchema.shape.password
});

type State = z.infer<typeof formSchema>;
const FirstLoginResetPassword = () => {
  const {
    resetPassword: {
      mutation: resetPasswordMutation,
      isLoading: isResettingPassword
    },
    user
  } = useAuth();

  const queryClient = useQueryClient();
  const { mutateAsync: skipResetPassword, isPending: isSkippingResetPassword } = useMutation({
    mutationFn: () => {
      if (user) {
        userServices.updateOne({ id: user.id }, { status: 'active' });
      }
      throw new Error('User does not exist');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
    }
  });

  const form = useForm<State>({
    resolver: zodResolver(formSchema)
  });

  const handleSubmit = async (values: State) => {
    resetPasswordMutation(values);
    form.reset();
  };

  return (
    <Dialog defaultOpen>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader className='text-left'>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            You are using a computer generated password.
            Please create a new password for better security.
          </DialogDescription>
        </DialogHeader>
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
            <DialogFooter>
              <Button
                className="w-full"
                isLoading={isResettingPassword}
                type="submit"
              >
                Reset Password
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => skipResetPassword()}
                isLoading={isSkippingResetPassword}
                type="button"
              >
                Skip
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstLoginResetPassword;
