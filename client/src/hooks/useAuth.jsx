import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication on app load
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          setUser(res.data.user);
          localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const { user: loggedInUser, token: authToken } = res.data;

    localStorage.setItem('taskflow_token', authToken);
    localStorage.setItem('taskflow_user', JSON.stringify(loggedInUser));

    setToken(authToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    const { user: registeredUser, token: authToken } = res.data;

    localStorage.setItem('taskflow_token', authToken);
    localStorage.setItem('taskflow_user', JSON.stringify(registeredUser));

    setToken(authToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, login, register, logout }}>
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

export default useAuth;
