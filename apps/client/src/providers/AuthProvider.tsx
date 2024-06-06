import { RegisterUser, User, LoginUser } from '@fullstack_package/interfaces';
import { createContext, useContext, useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import services from '@/services';
import { showErrorAlert } from '@/lib/utils';

interface AuthProviderState {
  isAuthenticated: boolean | null;
  user: User | null;
  signIn: (data: LoginUser) => void;
  signUp: (data: RegisterUser) => void;
  signOut: () => void;
}

const initialState: AuthProviderState = {
  isAuthenticated: false,
  user: null,
  signIn: () => null,
  signUp: () => null,
  signOut: () => null
};

const AuthContext = createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] =
    useState<Pick<AuthProviderState, 'isAuthenticated' | 'user'>>(initialState);

  useEffect(() => {
    const checkAuthentication = async () => {
      const { user, isAuthenticated } = (await services.auth.status()).data;
      setState({
        isAuthenticated,
        user
      });
    };

    checkAuthentication();
  }, []);

  const signOut = async () => {
    try {
      await services.auth.signOut();
      setState({
        user: null,
        isAuthenticated: false
      });
      redirect('/sign-in');
    } catch (e) {
      console.error(e);
      showErrorAlert('Error logging out');
    }
  };

  const signIn = async (data: LoginUser) => {
    try {
      const user = (await services.auth.signIn(data)).data;
      setState({
        user,
        isAuthenticated: true
      });
      redirect('/dashboard');
    } catch (e) {
      showErrorAlert('Could not sign you in!');
    }
  };

  const signUp = async (data: RegisterUser) => {
    try {
      const user = (await services.auth.signUp(data)).data;
      setState({
        user,
        isAuthenticated: true
      });
      redirect('/sign-in');
    } catch (e) {
      showErrorAlert('Could not sign you up!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
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
