import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Minus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  If, Then, Else,
  Button
} from '@trg_package/vite/components';
import { useToast } from '@trg_package/vite/hooks';
import { useIsAllowed } from '@/hooks';

interface IDeleteEntityProps {
  module: {
    name: string;
    id: string;
    type: string;
  };
}

export const DeleteEntity: React.FC<IDeleteEntityProps> = ({
  module: { id, name, type }
}) => {
  const queryClient = useQueryClient();
  const [services, setServices] = useState<any>(null); // To hold dynamically imported services

  useEffect(() => {
    const loadServices = async () => {
      const serviceModule = await import(`../../../services/${type}`);
      setServices(serviceModule.services);
    };

    loadServices();
  }, [type]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => services.deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [type.toLowerCase(), 'getAll']
      });
    }
  });
  const { toast } = useToast();

  const isDeleteAllowed = useIsAllowed({
    module: type,
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
              title: `Delete ${type}`,
              description: `Are you sure you want to delete ${name} from ${type}`,
              action: (
                <Button
                  isLoading={isPending}
                  type='button'
                  onClick={() => mutateAsync()}
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
