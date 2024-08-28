import {
  UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { Minus, Trash } from 'lucide-react';
import React from 'react';
import { useToast } from '@/lib/hooks/useToast';
import { ToastAction } from '@trg_package/components';
import { If, Then, Else } from '../utility';
import { useIsAllowed } from '@/lib/hooks';

interface IDeleteEntityProps {
  options: {
    mutation: UseMutationOptions;
    name: string;
    module: string;
  };
}

export const DeleteEntity: React.FC<IDeleteEntityProps> = ({
  options: { module, mutation, name }
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [module.toLowerCase(), 'getAll']
      });
    },
    ...mutation
  });
  const { toast } = useToast();

  const isDeleteAllowed = useIsAllowed({
    module,
    action: 'Delete'
  });

  return (
    <If condition={!!isDeleteAllowed}>
      <Then>
        <Trash
          className="text-red-500 cursor-pointer"
          size={20}
          onClick={() => {
            toast({
              variant: 'destructive',
              title: `Delete ${module}`,
              description: `Are you sure you want to delete ${name} from ${module}`,
              action: (
                <ToastAction
                  altText={`Delete from ${module}`}
                  onClick={() => mutateAsync()}
                >
                  Delete
                </ToastAction>
              )
            });
          }}
        />
      </Then>
      <Else>
        <Minus />
      </Else>
    </If>
  );
};
