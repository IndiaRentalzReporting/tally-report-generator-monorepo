import { createContext, useContext, useEffect, useState } from 'react';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import services from '@/services';
import {
  LoginUser,
  RegisterUser,
  SafeUserSelect,
  TenantInsert
} from '@trg_package/auth-schemas/types';
import { AxiosResponse } from 'axios';

interface AuthProviderState {
  user: SafeUserSelect | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{
        user: SafeUserSelect;
      }>,
      Error,
      { user: RegisterUser; tenant: TenantInsert }
    >;
  };
  signIn: {
    isLoading: boolean;
    mutation: UseMutateAsyncFunction<
      AxiosResponse<{
        user: SafeUserSelect;
      }>,
      Error,
      LoginUser
    >;
  };
}

const initialState: AuthProviderState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  signUp: {
    mutation: () => Promise.reject('SignUp Mutation does not exist'),
    isLoading: false
  },
  signIn: {
    mutation: () => Promise.reject('SignIn Mutation does not exist'),
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
    useState<Omit<AuthProviderState, 'signIn' | 'signUp'>>(initialState);

  const { data: authData, isFetching } = useQuery({
    queryFn: () => services.status(),
    select: (data) => data.data,
    queryKey: ['auth', 'status'],
    refetchOnMount: true,
    staleTime: 1000 * 60 * 15
  });

  const { mutateAsync: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: (data: { user: RegisterUser; tenant: TenantInsert }) =>
      services.signUp(data),
    mutationKey: ['auth', 'signUp']
  });

  const { mutateAsync: signInMutation, isPending: isSigningIn } = useMutation({
    mutationFn: (data: LoginUser) => services.signIn(data),
    mutationKey: ['auth', 'signUp'],
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
    }
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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn: { mutation: signInMutation, isLoading: isSigningIn },
        signUp: { mutation: signUpMutation, isLoading: isSigningUp }
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
