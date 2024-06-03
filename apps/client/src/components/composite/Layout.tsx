import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Navbar } from './Navbar';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContainerFull: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
    <section className={`container mx-auto px-6 ${className}`}>
      {children}
    </section>
  );
};

export const ContainerSm: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
    <section className={`max-w-6xl w-full mx-auto px-6 ${className}`}>
      {children}
    </section>
  );
};

export const Layout: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer />
      <Navbar key={pathname} />
      <ContainerSm>
        <Outlet />
      </ContainerSm>
    </div>
  );
};
