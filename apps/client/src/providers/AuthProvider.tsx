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
import { AxiosError, AxiosResponse } from 'axios';
import services from '@/services';
import { showErrorAlert } from '@/lib/utils';

interface AuthProviderState {
  isAuthenticated: boolean | null;
  user: User | null;
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
    useState<Pick<AuthProviderState, 'isAuthenticated' | 'user'>>(initialState);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authData } = useQuery({
    queryFn: () => services.auth.status(),
    queryKey: ['auth', 'statusCheck']
    // refetchInterval: 1000 * 60 * 15
  });

  const { mutateAsync: signOutMutation } = useMutation({
    mutationFn: () => services.auth.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      setState({
        user: null,
        isAuthenticated: false
      });
    }
  });

  const { mutateAsync: signInMutation } = useMutation({
    mutationFn: (data: LoginUser) => services.auth.signIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    }
  });

  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: (data: RegisterUser) => services.auth.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      setState({
        user: null,
        isAuthenticated: false
      });
      navigate('/sign-in');
    }
  });

  useEffect(() => {
    if (authData && authData.data) {
      setState({
        user: authData.data.user,
        isAuthenticated: authData.data.isAuthenticated
      });
    }
  }, [authData]);

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

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
