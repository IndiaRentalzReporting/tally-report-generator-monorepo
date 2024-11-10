import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Minus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  If, Then, Else,
  Button
} from '@trg_package/vite/components';
import { useToast } from '@trg_package/vite/hooks';
import { useIsAllowed } from '@/hooks';
import { CrudServices } from '@/services';

interface IDeleteEntityProps {
  module: {
    name: string;
    id: string;
    type: {
      main: string;
      sideEffect?: Array<string>;
    };
  };
}

const Delete: React.FC<IDeleteEntityProps> = ({
  module: { id, name, type: { main, sideEffect = [] } },
}) => {
  const queryClient = useQueryClient();
  const [deleteOneService, setDeleteOneService] = useState<
  CrudServices<'', object, object>['deleteOne'] | null
  >(null);

  useEffect(() => {
    const loadServices = async () => {
      const { services: { deleteOne: DO } } = await import(`../../../services/${main}`);
      setDeleteOneService(() => DO);
    };

    loadServices();
  }, [main]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!deleteOneService) {
        throw new Error('Delete service not initialized');
      }
      return deleteOneService({ id });
    },
    onSuccess: () => {
      sideEffect.concat([main]).forEach((service) => {
        queryClient.invalidateQueries({
          queryKey: [service, 'getAll']
        });
      });
    }
  });

  const { toast } = useToast();

  const isDeleteAllowed = useIsAllowed({
    module: main,
    action: 'Delete'
  });

  return (
    <If condition={!!isDeleteAllowed}>
      <Then>
        <Trash
          className="text-red-500 cursor-pointer"
          size={20}
          onClick={() => {
            const { dismiss } = toast({
              variant: 'destructive',
              title: `Delete ${main}`,
              description: `Are you sure you want to delete ${name} from ${main}`,
              action: (
                <Button
                  isLoading={isPending}
                  type='button'
                  onClick={async () => {
                    await mutateAsync();
                    dismiss();
                  }}
                >
                  Delete
                </Button>
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

export default Delete;
