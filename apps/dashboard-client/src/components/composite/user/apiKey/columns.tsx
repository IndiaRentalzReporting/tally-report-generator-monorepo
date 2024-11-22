import { ColumnDef } from '@tanstack/react-table';
import { Copy, Trash2 } from 'lucide-react';
import { Button } from '@trg_package/vite/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SortingButton } from '@/components/composite/SortingButton';
import { SelectState } from './interface';
import { useToast } from '$/lib/hooks';
import { services } from '@/services/ApiKey';

export const columns: ColumnDef<SelectState>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortingButton column={column} label="Name" />
  },
  {
    accessorKey: 'key',
    header: 'Key',
    cell: ({ row }) => {
      const { key } = row.original;
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {key.slice(0, 8)}...{key.slice(-4)}
        </code>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { toast } = useToast();
      const { key, id = '' } = row.original;
      const queryClient = useQueryClient();

      const { mutateAsync: deleteApiKey, isPending: deletingApiKey } = useMutation({
        mutationFn: () => services.deleteOne({ id }),
        mutationKey: ['apiKeys', 'delete'],
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys', 'read'] })
      });

      return (
        <div className='flex items-center gap-4'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigator
                .clipboard
                .writeText(key)
                .then(() => {
                  toast({
                    title: 'API Key Copied',
                    description: 'Your API Key has been copied to your clipboard',
                    variant: 'default'
                  });
                });
            }}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy API key</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteApiKey()}
            isLoading={deletingApiKey}
          >
            <Trash2 color='red' className="h-4 w-4" />
            <span className="sr-only">Delete API key</span>
          </Button>
        </div>
      );
    },
  }
];
