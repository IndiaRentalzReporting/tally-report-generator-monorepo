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
  FormField,
  FormItem,
  FormMessage,
  If,
  Else,
  Then,
  Skeleton,
  DropdownMenuItem
} from '@trg_package/vite/components';
import { CopyIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiKeySelect, ApiKeySelectSchema } from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@trg_package/vite/hooks';
import { services } from '@/services/ApiKey';

const formSchema = ApiKeySelectSchema.pick({ name: true });
type State = z.infer<typeof formSchema>;

const ApiKeys = () => {
  const queryClient = useQueryClient();
  const form = useForm<State>({
    resolver: zodResolver(formSchema),
  });

  const { data: apiKeys = [], isFetching: loadingApiKeys } = useQuery({
    queryFn: () => services.read(),
    select: (data) => data.data.apiKeys,
    queryKey: ['apiKeys', 'read'],
  });

  const { mutateAsync: createApiKey, isPending: creatingApiKey } = useMutation({
    mutationFn: (data: State) => services.createOne({
      ...data,
      key: 'temporary key'
    }),
    mutationKey: ['apiKeys', 'create'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys', 'read'] })
  });

  const handleSubmit = (values: State) => {
    createApiKey(values);
    form.reset();
  };

  return (
    <DropdownMenuSubContent className='w-[300px]'>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Create New API Key</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-start gap-2 p-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder="API Key Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="icon"
                  isLoading={creatingApiKey}
                >
                  <PlusIcon/>
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
            <p className='text-center text-sm text-foreground p-4 mx-auto'>No API Keys</p>
          </Then>
          <Else >
            <Skeleton isLoading={loadingApiKeys}>
              <div className="flex flex-col gap-1 w-full">
                {apiKeys.map((key) => (
                  <ApiKey key={key.id} id={key.id} name={key.name} keyProp={key.key} />
                ))}
              </div>
            </Skeleton>
          </Else>
        </If>
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  );
};

const ApiKey: React.FC<{
  id: ApiKeySelect['id'];
  name: ApiKeySelect['name'];
  keyProp: ApiKeySelect['key'];
}> = ({ id, name, keyProp: key }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteApiKey, isPending: deletingApiKey } = useMutation({
    mutationFn: (id: string) => services.deleteOne({ id }),
    mutationKey: ['apiKeys', 'delete'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys', 'read'] })
  });

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
      toast({
        title: 'Unable to copy to clipboard',
        description: 'Please try again',
      });
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
    <>
      <div className="flex items-center justify-between w-full">
        <span className="font-medium">{name}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(key)}
          >
            <CopyIcon />
            <span className="sr-only">Copy API Key</span>
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteApiKey(id);
            }}
            type="button"
            variant="ghost"
            size="icon"
            isLoading={deletingApiKey}
            className="text-destructive"
          >
            <Trash2Icon />
            <span className="sr-only">Delete API Key</span>
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground" >
        {key}
      </div>
    </>
  );
};

export default ApiKeys;
