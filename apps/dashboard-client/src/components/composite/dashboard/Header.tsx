import React from 'react';
import { When } from '@trg_package/vite/components';
import { Link } from 'react-router-dom';
import { useNav } from '@/providers/NavigationProvider';
import Create from './Create';

const Header: React.FC = () => {
  const { currentModule } = useNav();

  return (
    <When condition={!!currentModule}>
      <div className="flex items-center w-full justify-between">
        <Link to={`/dashboard/${currentModule}/Read`}>
          <h1 className="text-lg font-semibold md:text-2xl">{currentModule}</h1>
        </Link>
        <Create module={currentModule!} />
      </div>
    </When>
  );
};

export default Header;
