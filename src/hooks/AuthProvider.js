import React, { createContext, useState, useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalError } from './Errors';
import { loginRequest, signupRequest } from '../api/actions';
import Cookies from 'universal-cookie';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Error on auth context');
  }

  return context;
}

export const AuthProvider = ({ children }) => {
  const cookies = new Cookies();
  const history = useHistory();

  const { setErrors } = useGlobalError();

  const [authData, setAuthData] = useState(() => {
    const user = cookies.get('user');
    return user || null;
  });

  const getUser = () => {
    const user = cookies.get('user');
    if (authData && !user) {
      setAuthData(null);
    }
    return authData;
  };

  const signIn = useCallback(
    async ({ username, password }) => {
      try {
        await loginRequest(username, password);
        cookies.set('user', { username, password }, { path: '/' });

        setAuthData({ username, password });
      } catch (error) {
        setErrors([error.message]);
      }
    },
    [cookies, setErrors]
  );

  const signOut = () => {
    localStorage.removeItem('user');
    setErrors([]);
    setAuthData(null);
    cookies.remove('user');
    history.push('/login');
  };

  const signup = async (user) => {
    try {
      await signupRequest(user);
      console.log(user);

      cookies.set('user', { ...user }, { path: '/' });

      setAuthData({ username: user.username, password: user.password });
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user: authData, signIn, signOut, signup, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
