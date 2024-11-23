import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Input, DialogFooter, Button, Form,
  FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@trg_package/vite/components';
import { TenantInsertSchema } from '@trg_package/schemas-auth/types';
import { useAuth } from '@trg_package/vite/providers';

const formSchema = TenantInsertSchema.pick({ name: true });
type State = z.infer<typeof formSchema>;

const CreateTeam: React.FC = () => {
  const form = useForm<State>({
    resolver: zodResolver(formSchema)
  });

  const { createTeam: { mutation, isLoading } } = useAuth();

  const onSubmit = (data: State) => {
    mutation(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className='self-start'>
          <Button isLoading={isLoading} type="submit">Create Team</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateTeam;
