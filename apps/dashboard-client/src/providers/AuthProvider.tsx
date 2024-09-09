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
} from '@trg_package/dashboard-schemas/types';
import { AxiosResponse } from 'axios';
import { RegisterUser, SafeUserSelect } from '@trg_package/auth-schemas/types';

interface AuthProviderState {
  isAuthenticated: boolean;
  user: DetailedUser | null;
  loading: boolean;
  permissions: Permissions[];
  signOut: UseMutateAsyncFunction<
    AxiosResponse<{
      message: string;
    }>
  >;
  signUp: UseMutateAsyncFunction<
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
}

const initialState: AuthProviderState = {
  isAuthenticated: false,
  loading: true,
  user: null,
  permissions: JSON.parse(
    localStorage.getItem('permissions') ?? '[]'
  ) as AuthProviderState['permissions'],
  signOut: () => Promise.reject('SignOut Mutation does not exist'),
  signUp: () => Promise.reject('SignUp Mutation does not exist')
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
      onSettled() {
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
      loading: isFetching || isSigningOut || isSigningUp
    }));
  }, [isFetching]);

  return (
    <AuthContext.Provider
      value={{ ...state, signUp: signUpMutation, signOut: signOutMutation }}
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
