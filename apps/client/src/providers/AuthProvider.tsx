/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { RegisterUser, User, LoginUser } from '@fullstack_package/interfaces';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import services from '@/services';

interface AuthProviderState {
  isAuthenticated: boolean | null;
  user: User | null;
  loading: boolean;
  signIn: UseMutateAsyncFunction<
    AxiosResponse<User, any>,
    Error,
    LoginUser,
    unknown
  > | null;
  signUp: UseMutateAsyncFunction<
    AxiosResponse<User, any>,
    Error,
    RegisterUser,
    unknown
  > | null;
  signOut: UseMutateAsyncFunction<
    AxiosResponse<{ message: string }, any>,
    Error,
    void,
    unknown
  > | null;
}

const initialState: AuthProviderState = {
  isAuthenticated: false,
  loading: true,
  user: null,
  signIn: null,
  signUp: null,
  signOut: null
};

const AuthContext = createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] =
    useState<Pick<AuthProviderState, 'isAuthenticated' | 'user' | 'loading'>>(
      initialState
    );

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authData, fetchStatus } = useQuery({
    queryFn: () => services.auth.status(),
    queryKey: ['auth', 'statusCheck'],
    refetchInterval: 1000 * 60 * 15
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

  const { mutateAsync: signOutMutation, isPending: isSignOutPending } =
    useMutation({
      mutationFn: () => services.auth.signOut(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth', 'statusCheck'] });
      }
    });

  const { mutateAsync: signInMutation, isPending } = useMutation({
    mutationFn: (data: LoginUser) => services.auth.signIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'statusCheck'] });
    }
  });

  useEffect(() => console.log({ isPending }), [isPending]);

  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: (data: RegisterUser) => services.auth.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'statusCheck'] });
      navigate('/sign-in');
    }
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: fetchStatus === 'fetching' || isSignOutPending
    }));
  }, [fetchStatus, isSignOutPending]);

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...state,
        signIn: signInMutation,
        signUp: signUpMutation,
        signOut: signOutMutation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
