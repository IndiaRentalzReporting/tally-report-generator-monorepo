import {
  createContext, useContext, useEffect, useMemo, useState
} from 'react';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  LoginUser,
  RegisterUser,
  TenantInsert,
  TenantSelect,
  UserSelect
} from '@trg_package/schemas-auth/types';
import { AxiosResponse } from 'axios';
import { UserRole, Permissions, SafeUserSelect } from '@trg_package/schemas-dashboard/types';
import { useToast } from '$/lib/hooks';
import services from '../services';
import { DetailedUser } from '../models';
import { toTitleCase } from '$/lib/utils';

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
    AxiosResponse<{ tenant: TenantSelect; user: SafeUserSelect }>,
    Error,
    { user: RegisterUser; tenant: TenantInsert }
    >;
  };
  signIn: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
    AxiosResponse<{ user: DetailedUser, redirect?: string }>,
    Error,
    LoginUser
    >;
  };
  signUp: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
    AxiosResponse<{ user: UserSelect }>,
    Error,
    Omit<RegisterUser, 'password'>
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
  permissions: JSON.parse(localStorage.getItem('permissions') ?? '[]'),
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthProviderState>(initialState);

  const { data: authStatus, isFetching: isAuthStatusPending } = useQuery({
    queryFn: services.status,
    queryKey: ['auth', 'status'],
    staleTime: 1000 * 60 * 15,
    select: (data) => data.data
  });

  const { mutateAsync: onboardMutation, isPending: isOnboarding } = useMutation(
    {
      mutationFn: (data: { user: RegisterUser; tenant: TenantInsert }) => services.onboard(data),
      mutationKey: ['auth', 'onboard'],
      onSuccess: () => {
        toast({
          title: 'Onboarded!',
          description: 'You have successfully onboarded!',
          variant: 'default'
        });
        queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
      }
    }
  );

  const { mutateAsync: signInMutation, isPending: isSigningIn } = useMutation({
    mutationFn: (data: LoginUser) => services.signIn(data),
    mutationKey: ['auth', 'signIn'],
    onSuccess: () => {
      toast({
        title: 'Signed In',
        description: 'You have successfully signed in!',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
    }
  });

  const { mutateAsync: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: (data: Omit<RegisterUser, 'password'>) => services.signUp(data),
    mutationKey: ['auth', 'signUp'],
    onSuccess: () => {
      toast({
        title: 'Signed Up',
        description: 'User successfully signed up!',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
    }
  });

  const { mutateAsync: signOutMutation, isPending: isSigningOut } = useMutation(
    {
      mutationFn: services.signOut,
      mutationKey: ['auth', 'signOut'],
      onSuccess: () => {
        toast({
          title: 'Signed Out',
          description: 'You have successfully signed out!',
          variant: 'default'
        });
        queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
      }
    }
  );

  const createPermissions = (
    permissions: UserRole['permission'] | undefined
  ): Permissions[] => permissions
    ?.filter(({ module }) => !!module)
    .map(({ module, permissionAction }) => ({
      module: { name: toTitleCase(module.name), icon: module.icon },
      actions: permissionAction.map(({ action }) => toTitleCase(action.name))
    })) ?? [];

  useEffect(() => {
    let user;
    let isAuthenticated;
    if (!authStatus) {
      user = initialState.user;
      isAuthenticated = initialState.isAuthenticated;
    } else {
      user = authStatus.user;
      isAuthenticated = authStatus.isAuthenticated;
    }
    const permissions = user ? createPermissions(user.role?.permission) : [];
    localStorage.setItem('permissions', JSON.stringify(permissions));
    const tenant = user ? user.tenant?.name : null;

    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated,
      permissions,
      tenant,
    }));
  }, [authStatus]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: isAuthStatusPending
    }));
  }, [isAuthStatusPending]);

  const contextValue = useMemo(
    () => ({
      ...state,
      onboard: { mutation: onboardMutation, isLoading: isOnboarding },
      signIn: { mutation: signInMutation, isLoading: isSigningIn },
      signUp: { mutation: signUpMutation, isLoading: isSigningUp },
      signOut: { mutation: signOutMutation, isLoading: isSigningOut }
    }),
    [
      state,
      isOnboarding,
      isSigningIn,
      isSigningUp,
      isSigningOut,
      onboardMutation,
      signInMutation,
      signOutMutation,
      signUpMutation
    ]
  );

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
