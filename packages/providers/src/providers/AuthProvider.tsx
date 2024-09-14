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
  TenantInsert
} from '@trg_package/schemas-auth/types';
import { AxiosResponse } from 'axios';
import { ToastAction, useToast } from '@trg_package/components';
import { useNavigate } from 'react-router';
import { UserRole, Permissions } from '@trg_package/schemas-dashboard/types';
import { DetailedUser } from '../models';

interface AuthProviderState {
  user: DetailedUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  permissions: Permissions[];
  tenant: TenantInsert['name'] | null;
  signUp: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{
        user: DetailedUser;
      }>,
      Error,
      { user: RegisterUser; tenant: TenantInsert }
    >;
  };
  signIn: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{
        user: DetailedUser;
      }>,
      Error,
      LoginUser
    >;
  };
  signOut: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{
        message: string;
      }>,
      Error
    >;
  };
}

const initialState: AuthProviderState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  permissions: JSON.parse(
    localStorage.getItem('permissions') ?? '[]'
  ) as AuthProviderState['permissions'],
  tenant: null,
  signUp: {
    mutation: () => Promise.reject('SignUp Mutation does not exist'),
    isLoading: false
  },
  signIn: {
    mutation: () => Promise.reject('SignIn Mutation does not exist'),
    isLoading: false
  },
  signOut: {
    mutation: () => Promise.reject('SignOut Mutation does not exist'),
    isLoading: false
  }
};

const AuthContext = createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [state, setState] =
    useState<Omit<AuthProviderState, 'signIn' | 'signUp' | 'signOut'>>(
      initialState
    );

  const { data: authStatus, isFetching } = useQuery({
    queryFn: () => services.status(),
    select: (data) => data.data,
    queryKey: ['auth', 'status'],
    staleTime: 1000 * 60 * 15
  });

  const { mutateAsync: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: (data: { user: RegisterUser; tenant: TenantInsert }) =>
      services.signUp(data),
    mutationKey: ['auth', 'signUp'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
      toast({
        variant: 'default',
        title: `Sign up successful`,
        description: `You have successfully signed up!`,
        action: (
          <ToastAction
            altText="Okay!"
            onClick={() => {
              navigate('/sign-in');
            }}
          >
            Okay!
          </ToastAction>
        )
      });
    }
  });

  const { mutateAsync: signInMutation, isPending: isSigningIn } = useMutation({
    mutationFn: (data: LoginUser) => services.signIn(data),
    mutationKey: ['auth', 'signIn'],
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
    }
  });

  const { mutateAsync: signOutMutation, isPending: isSigningOut } = useMutation(
    {
      mutationFn: () => services.signOut(),
      mutationKey: ['auth', 'signOut'],
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
      }
    }
  );

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
    const tenant = user.tenant?.name;

    setState({
      user,
      isAuthenticated,
      permissions,
      tenant,
      loading: false
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
        signIn: { mutation: signInMutation, isLoading: isSigningIn },
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
