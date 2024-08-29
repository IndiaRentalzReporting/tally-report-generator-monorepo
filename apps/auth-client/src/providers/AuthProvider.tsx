import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import services from '@/services';
import { SafeUserSelect } from '../../../../packages/schemas-auth/dist/types';

interface AuthProviderState {
  isAuthenticated: boolean;
  user: SafeUserSelect | null;
  loading: boolean;
}

const initialState: AuthProviderState = {
  isAuthenticated: false,
  loading: true,
  user: null
};

const AuthContext = createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthProviderState>(initialState);

  const { data: authData, isFetching } = useQuery({
    queryFn: () => services.Authentication.status(),
    select: (data) => data.data,
    queryKey: ['auth', 'status'],
    staleTime: 1000 * 60 * 15
  });

  useEffect(() => {
    if (!authData || !authData.user || !authData.isAuthenticated) {
      setState({
        ...initialState
      });
      return;
    }

    const { user, isAuthenticated } = authData;

    setState({
      user,
      isAuthenticated,
      loading: false
    });
  }, [authData]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: isFetching
    }));
  }, [isFetching]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
