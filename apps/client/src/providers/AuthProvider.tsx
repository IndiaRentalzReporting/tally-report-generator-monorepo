/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { User } from '@fullstack_package/interfaces';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import services from '@/services';

interface AuthProviderState {
  isAuthenticated: boolean | null;
  user: User | null;
  loading: boolean;
}

const initialState: AuthProviderState = {
  isAuthenticated: true,
  loading: true,
  user: null
};

const AuthContext = createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthProviderState>(initialState);

  const { data: authData, fetchStatus } = useQuery({
    queryFn: () => services.auth.status(),
    queryKey: ['auth', 'statusCheck'],
    staleTime: 1000 * 60 * 15
  });

  useEffect(() => {
    if (authData && authData.data) {
      setState({
        user: authData.data.user,
        isAuthenticated: authData.data.isAuthenticated,
        loading: false
      });
    }
  }, [authData]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: fetchStatus === 'fetching'
    }));
  }, [fetchStatus]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
