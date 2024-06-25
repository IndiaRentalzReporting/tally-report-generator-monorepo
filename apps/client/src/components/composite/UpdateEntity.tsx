import { Edit, Minus } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { If, Then, Else } from '../utility';
import { useIsAllowed } from '@/lib/hooks';

interface IUpdateEntityProps {
  module: string;
  id: string;
}

export const UpdateEntity: React.FC<IUpdateEntityProps> = ({ module, id }) => {
  const isEditAllowed = useIsAllowed({
    module: 'Users',
    action: 'Update'
  });
  return (
    <If condition={!!isEditAllowed}>
      <Then>
        <Link to={`/dashboard/${module}/Update/${id}`}>
          <Edit size={20} className="text-green-500" />
        </Link>
      </Then>
      <Else>
        <Minus />
      </Else>
    </If>
  );
};
