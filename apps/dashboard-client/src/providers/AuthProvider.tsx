import { createContext, useContext, useEffect, useState } from 'react';
import {
  useMutation,
  useQuery,
  UseMutateAsyncFunction,
  useQueryClient
} from '@tanstack/react-query';
import services from '@/services';
import {
  DetailedUser,
  Permissions,
  UserRole
} from '@trg_package/schemas-dashboard/types';
import { AxiosResponse } from 'axios';
import { RegisterUser, SafeUserSelect } from '@trg_package/schemas-auth/types';

interface AuthProviderState {
  isAuthenticated: boolean;
  user: DetailedUser | null;
  loading: boolean;
  permissions: Permissions[];
  signOut: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{
        message: string;
      }>
    >;
  };
  signUp: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<
        {
          user: SafeUserSelect;
        },
        any
      >,
      Error,
      RegisterUser,
      unknown
    >;
  };
}

const initialState: AuthProviderState = {
  isAuthenticated: false,
  loading: true,
  user: null,
  permissions: JSON.parse(
    localStorage.getItem('permissions') ?? '[]'
  ) as AuthProviderState['permissions'],
  signOut: {
    mutation: () => Promise.reject('SignOut Mutation does not exist'),
    isLoading: false
  },
  signUp: {
    mutation: () => Promise.reject('SignUp Mutation does not exist'),
    isLoading: false
  }
};

const AuthContext = createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();

  const [state, setState] =
    useState<Omit<AuthProviderState, 'signUp' | 'signOut'>>(initialState);

  const { data: authStatus, isFetching } = useQuery({
    queryFn: () => services.Authentication.status(),
    select: (data) => data.data,
    queryKey: ['auth', 'status'],
    staleTime: 1000 * 60 * 15
  });

  const { mutateAsync: signOutMutation, isPending: isSigningOut } = useMutation(
    {
      mutationFn: () => services.Authentication.signOut(),
      mutationKey: ['auth', 'signOut'],
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
      }
    }
  );

  const { mutateAsync: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: (data: RegisterUser) => services.Authentication.signUp(data),
    mutationKey: ['auth', 'signUp']
  });

  const createPermissions = (
    permissions: UserRole['permission'] | undefined
  ): Permissions[] => {
    const p =
      permissions?.map(({ module, permissionAction }) => {
        const { name, icon } = module;
        return {
          module: { name, icon },
          actions: permissionAction.map(({ action }) => action.name)
        };
      }) ?? [];
    localStorage.setItem('permissions', JSON.stringify(p));
    return p;
  };

  useEffect(() => {
    if (!authStatus || !authStatus.user || !authStatus.isAuthenticated) {
      setState({
        ...initialState,
        permissions: []
      });
      return;
    }

    const { user, isAuthenticated } = authStatus;
    const permissions = createPermissions(user.role?.permission);

    setState({
      user,
      isAuthenticated,
      loading: false,
      permissions
    });
  }, [authStatus]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: isFetching
    }));
  }, [isFetching]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp: { mutation: signUpMutation, isLoading: isSigningUp },
        signOut: { mutation: signOutMutation, isLoading: isSigningOut }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
