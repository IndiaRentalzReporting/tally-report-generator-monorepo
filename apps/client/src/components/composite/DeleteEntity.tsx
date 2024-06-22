import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import React from 'react';
import { useToast } from '@/lib/hooks/useToast';
import { ToastAction } from '../ui/toast';

interface IDeleteEntityProps {
  options: { mutation: UseMutationOptions; name: string; module: string };
}

const DeleteEntity: React.FC<IDeleteEntityProps> = ({
  options: { module, mutation, name }
}) => {
  const { mutateAsync } = useMutation(mutation);
  const { toast } = useToast();

  return (
    <Trash
      className="text-red-500 cursor-pointer"
      size={20}
      onClick={() => {
        toast({
          variant: 'destructive',
          title: `Delete ${module}`,
          description: `Are you sure you want to delete ${name} ${module}`,
          action: (
            <ToastAction
              altText={`Delete ${module}`}
              onClick={() => mutateAsync()}
            >
              Delete
            </ToastAction>
          )
        });
      }}
    />
  );
};

export default DeleteEntity;
