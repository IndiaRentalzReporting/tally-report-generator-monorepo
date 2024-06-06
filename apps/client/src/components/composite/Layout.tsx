import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Navbar } from './Navbar';
import useAuthentication from '@/lib/hooks/useAuthentication';
import { When } from '../utility';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContainerFull: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
    <section className={`container mx-auto px-6 ${className} min-h-full`}>
      {children}
    </section>
  );
};

export const ContainerSm: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
    <section
      className={`max-w-6xl w-full mx-auto px-6 ${className} min-h-full`}
    >
      {children}
    </section>
  );
};

export const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthentication();

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer />
      <When condition={isAuthenticated}>
        <Navbar key={pathname} />
      </When>
      <ContainerSm>
        <Outlet />
      </ContainerSm>
    </div>
  );
};
