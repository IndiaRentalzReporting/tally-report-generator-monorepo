/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import services from '@/services';
import { DetailedUser, Permissions } from '@/models';

interface AuthProviderState {
  isAuthenticated: boolean;
  user: DetailedUser | null;
  loading: boolean;
  permissions: Permissions[];
}

const initialState: AuthProviderState = {
  isAuthenticated: false,
  loading: true,
  user: null,
  permissions: JSON.parse(
    localStorage.getItem('permissions') ?? '[]'
  ) as AuthProviderState['permissions']
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
    queryKey: ['auth', 'statusCheck'],
    staleTime: 1000 * 60 * 15
  });

  useEffect(() => {
    if (!authData || !authData.user || !authData.isAuthenticated) {
      setState({
        ...initialState,
        permissions: []
      });
      return;
    }

    const { user, isAuthenticated } = authData;

    const permissions =
      user.role?.permission.map(({ module, permissionAction }) => {
        const { name, icon } = module;
        return {
          module: { name, icon },
          actions: permissionAction.map(({ action }) => action.name)
        };
      }) ?? [];
    localStorage.setItem('permissions', JSON.stringify(permissions));

    setState({
      user,
      isAuthenticated,
      loading: false,
      permissions
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
