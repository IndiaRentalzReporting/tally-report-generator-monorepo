import { useMutation } from '@tanstack/react-query';
import { AxiosPromise } from 'axios';
import { Trash } from 'lucide-react';
import React from 'react';

interface IDeleteEntityProps {
  deleteRoute: () => AxiosPromise;
}

const DeleteEntity: React.FC<IDeleteEntityProps> = ({ deleteRoute }) => {
  const { mutateAsync } = useMutation({
    mutationFn: () => deleteRoute()
  });

  return (
    <Trash
      className="text-red-500 cursor-pointer"
      size={20}
      onClick={() => mutateAsync()}
    />
  );
};

export default DeleteEntity;
