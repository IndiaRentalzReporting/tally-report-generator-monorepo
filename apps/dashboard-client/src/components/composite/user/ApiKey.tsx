import {
  DropdownMenuSeparator,
  Button,
  Input,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  If,
  Else,
  Then,
  Skeleton,
  DropdownMenuItem
} from '@trg_package/vite/components';
import { CopyIcon, Trash2Icon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiKeySelectSchema } from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@trg_package/vite/hooks';
import { services } from '@/services/ApiKey';

const formSchema = ApiKeySelectSchema.pick({ name: true, key: true });
type State = z.infer<typeof formSchema>;

const ApiKey = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<State>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      key: 'null'
    }
  });

  const { data: apiKeys = [], isFetching: loadingApiKeys } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.apiKeys,
    queryKey: ['apiKeys', 'read'],
  });

  const { mutateAsync: deleteApiKey, isPending: deletingApiKey } = useMutation({
    mutationFn: (id: string) => services.deleteOne({ id }),
    mutationKey: ['apiKeys', 'delete'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys', 'read'] })
  });

  const { mutateAsync: createApiKey, isPending: creatingApiKey } = useMutation({
    mutationFn: (data: State) => services.createOne(data),
    mutationKey: ['apiKeys', 'create'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys', 'read'] })
  });

  const handleSubmit = (values: State) => {
    createApiKey(values);
    form.reset();
  };

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopy = (key: string) => {
    try {
      navigator.clipboard.writeText(key);
    } catch (err) {
      unsecuredCopyToClipboard(key);
    }
    toast({
      title: 'API Key Copied',
      description: 'Your API Key has been copied to your clipboard',
      variant: 'default'
    });
  };

  return (
    <DropdownMenuSubContent className='w-[300px]'>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Create New API Key</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col items-start gap-2 p-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Name</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder="Test Key"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="sm"
                  isLoading={creatingApiKey}
                >
                  Create
                </Button>
              </form>
            </Form>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <If condition={apiKeys.length === 0 && !loadingApiKeys}>
          <Then>
            <p className='text-center text-sm text-foreground'>No API Keys</p>
          </Then>
          <Else >
            <Skeleton isLoading={loadingApiKeys}>
              <div className="flex flex-col gap-1 w-full">
              {apiKeys.map((key) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{key.name}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(key.key)}
                      >
                        <CopyIcon className="h-4 w-4" />
                        <span className="sr-only">Copy API Key</span>
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteApiKey(key.id);
                        }}
                        type="button"
                        variant="ghost"
                        size="icon"
                        isLoading={deletingApiKey}
                        className="text-destructive"
                      >
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">Delete API Key</span>
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground" >
                    {key.key}
                  </div>
                </>

              ))}
              </div>
            </Skeleton>
          </Else>
        </If>
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  );
};

export default ApiKey;
