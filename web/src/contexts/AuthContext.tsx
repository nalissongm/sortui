import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/apiClient';

type User = {
  id: string;
  email: string;
  cpf?: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  user: User | undefined;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);
let authChannel: BroadcastChannel;

export function signOut(shouldPostMessage = true) {
  destroyCookie(undefined, 'sortui.token');
  destroyCookie(undefined, 'sortui.refreshToken');

  shouldPostMessage && authChannel.postMessage('signOut');

  Router.push('/auth');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('signOut');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut(false);
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { 'sortui.token': token } = parseCookies();

    if (token) {
      api
        .get('users/profile')
        .then((response) => {
          const { id, email, cpf } = response.data;

          setUser({ id, email, cpf });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn(credentials: SignInCredentials) {
    try {
      const response = await api.post('sessions', credentials);

      // eslint-disable-next-line camelcase
      const { token, refresh_token } = response.data;

      setCookie(undefined, 'sortui.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCookie(undefined, 'sortui.refreshToken', refresh_token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({
        id: response.data.sub,
        email: credentials.email,
      });

      // eslint-disable-next-line dot-notation
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
