/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import services from '@/services';
import { DetailedUser } from '@/models';

interface AuthProviderState {
  isAuthenticated: boolean;
  user: DetailedUser | null;
  loading: boolean;
  permissions:
    | {
        module: string;
        actions: string[];
      }[]
    | undefined;
}

const initialState: AuthProviderState = {
  isAuthenticated: true,
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

  const { data: authData, fetchStatus } = useQuery({
    queryFn: () => services.auth.status(),
    select: (data) => data.data,
    queryKey: ['auth', 'statusCheck'],
    staleTime: 1000 * 60 * 15
  });

  const toTitleCase = (str: string): string => {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  };

  useEffect(() => {
    if (!authData) return;
    const permissions = authData?.user?.role?.permission.map(
      ({ module, permissionAction }) => {
        const moduleName = module.name;
        return {
          module: toTitleCase(moduleName),
          actions: permissionAction.map(({ action }) =>
            toTitleCase(action.name)
          )
        };
      }
    );
    localStorage.setItem('permissions', JSON.stringify(permissions));
    setState({
      user: authData.user,
      isAuthenticated: authData.isAuthenticated,
      loading: false,
      permissions
    });
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
