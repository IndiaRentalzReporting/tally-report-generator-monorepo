import { createContext, useContext, useEffect, useState } from 'react';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import services from '../services';
import {
  LoginUser,
  RegisterUser,
  TenantInsert,
  UserSelect
} from '@trg_package/schemas-auth/types';
import { AxiosResponse } from 'axios';
import { UserRole, Permissions } from '@trg_package/schemas-dashboard/types';
import { DetailedUser } from '../models';

interface AuthProviderState {
  user: DetailedUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  permissions: Permissions[];
  tenant: TenantInsert['name'] | null;
}

interface AuthProviderMutation {
  onboard: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{ user: DetailedUser }>,
      Error,
      { user: RegisterUser; tenant: TenantInsert }
    >;
  };
  signIn: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{ user: DetailedUser }>,
      Error,
      LoginUser
    >;
  };
  signUp: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{ user: UserSelect }>,
      Error,
      RegisterUser
    >;
  };
  signOut: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<AxiosResponse<{ message: string }>, Error>;
  };
}

const initialState: AuthProviderState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  permissions: [],
  tenant: null
};

const initialMutation: AuthProviderMutation = {
  onboard: {
    mutation: () => Promise.reject('Onboard Mutation does not exist'),
    isLoading: false
  },
  signIn: {
    mutation: () => Promise.reject('SignIn Mutation does not exist'),
    isLoading: false
  },
  signUp: {
    mutation: () => Promise.reject('SignUp Mutation does not exist'),
    isLoading: false
  },
  signOut: {
    mutation: () => Promise.reject('SignOut Mutation does not exist'),
    isLoading: false
  }
};

interface AuthProviderContext extends AuthProviderState, AuthProviderMutation {}

const AuthContext = createContext<AuthProviderContext>({
  ...initialState,
  ...initialMutation
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
  const [state, setState] = useState<AuthProviderState>(initialState);

  const { data: authStatus } = useQuery({
    queryFn: services.status,
    queryKey: ['auth', 'status'],
    staleTime: 1000 * 60 * 15,
    select: (data) => data.data
  });

  const { mutateAsync: onboardMutation, isPending: isOnboarding } = useMutation(
    {
      mutationFn: (data: { user: RegisterUser; tenant: TenantInsert }) =>
        services.onboard(data),
      mutationKey: ['auth', 'onboard'],
      onSuccess
    }
  );

  const { mutateAsync: signInMutation, isPending: isSigningIn } = useMutation({
    mutationFn: (data: LoginUser) => services.signIn(data),
    mutationKey: ['auth', 'signIn'],
    onSuccess
  });

  const { mutateAsync: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: (data: RegisterUser) => services.signUp(data),
    mutationKey: ['auth', 'signUp'],
    onSuccess
  });

  const { mutateAsync: signOutMutation, isPending: isSigningOut } = useMutation(
    {
      mutationFn: services.signOut,
      mutationKey: ['auth', 'signOut'],
      onSuccess
    }
  );

  const createPermissions = (
    permissions: UserRole['permission'] | undefined
  ): Permissions[] => {
    return (
      permissions
        ?.filter(({ module }) => !!module)
        .map(({ module, permissionAction }) => ({
          module: { name: module.name, icon: module.icon },
          actions: permissionAction.map(({ action }) => action.name)
        })) ?? []
    );
  };

  useEffect(() => {
    if (authStatus && authStatus.isAuthenticated && authStatus.user) {
      const { user, isAuthenticated } = authStatus;
      const permissions = createPermissions(user.role?.permission);
      const tenant = user.tenant?.name;

      setState({
        user,
        isAuthenticated,
        permissions,
        tenant,
        loading: false
      });
    } else {
      setState({ ...initialState, loading: false });
    }
  }, [authStatus]);

  const contextValue = {
    ...state,
    onboard: { mutation: onboardMutation, isLoading: isOnboarding },
    signIn: { mutation: signInMutation, isLoading: isSigningIn },
    signUp: { mutation: signUpMutation, isLoading: isSigningUp },
    signOut: { mutation: signOutMutation, isLoading: isSigningOut }
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthProviderContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
