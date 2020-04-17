import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const AuthDataContext = createContext(null);

const initialAuthData = {};

const AuthDataProvider = props => {
  const [authData, setAuthData] = useState(initialAuthData);

  useEffect(() => {
    const currentAuthData = { token: localStorage.getItem('token') };
    if (currentAuthData.token) {
      setAuthData(currentAuthData);
    }
  }, []);

  const onLogout = () => setAuthData(initialAuthData);

  const onLogin = newAuthData => {
    localStorage.setItem('token', newAuthData.token);
    cookies.set('x-auth-token', newAuthData.token, { maxAge: 1000000 });
    setAuthData(newAuthData);
  };

  const authDataValue = { ...authData, onLogin, onLogout };

  return <AuthDataContext.Provider value={authDataValue} {...props} />;
};

export const useAuthDataContext = () => useContext(AuthDataContext);

export default AuthDataProvider;
