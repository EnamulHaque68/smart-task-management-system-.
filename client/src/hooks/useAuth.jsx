import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth.js';

const AuthContext = createContext(null);

// Safe storage helper with quota-exceeded guards
function safeSaveUser(userData) {
  if (!userData) {
    try {
      localStorage.removeItem('taskflow_user');
    } catch (e) {}
    return;
  }

  // Create a clean copy to prevent quota exceeded issues from huge base64 strings
  const safeCopy = { ...userData };
  if (
    typeof safeCopy.avatar_url === 'string' &&
    safeCopy.avatar_url.startsWith('data:') &&
    safeCopy.avatar_url.length > 50000
  ) {
    safeCopy.avatar_url = '/avatars/alex_morgan.jpg';
  }

  if (
    safeCopy.preferences &&
    typeof safeCopy.preferences.avatar_url === 'string' &&
    safeCopy.preferences.avatar_url.length > 50000
  ) {
    safeCopy.preferences = { ...safeCopy.preferences, avatar_url: '/avatars/alex_morgan.jpg' };
  }

  try {
    localStorage.setItem('taskflow_user', JSON.stringify(safeCopy));
  } catch (err) {
    console.warn('localStorage quota exceeded, saving minimal profile fallback:', err);
    try {
      // Clear any outdated big items
      localStorage.removeItem('taskflow_user');
      const minimalUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar_color: userData.avatar_color,
        avatar_url: typeof userData.avatar_url === 'string' && !userData.avatar_url.startsWith('data:') ? userData.avatar_url : null,
      };
      localStorage.setItem('taskflow_user', JSON.stringify(minimalUser));
    } catch (fallbackErr) {
      console.error('Failed to store even minimal user in localStorage:', fallbackErr);
    }
  }
}

function safeSaveToken(token) {
  try {
    if (token) {
      localStorage.setItem('taskflow_token', token);
    } else {
      localStorage.removeItem('taskflow_token');
    }
  } catch (e) {
    console.error('Failed to set taskflow_token:', e);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('taskflow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('taskflow_token');
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication on app load
  useEffect(() => {
    const verifyAuth = async () => {
      let storedToken = null;
      try {
        storedToken = localStorage.getItem('taskflow_token');
      } catch (e) {}

      if (storedToken) {
        try {
          const res = await getMeApi();
          const meUser = res.data.user;
          setUser(meUser);
          safeSaveUser(meUser);
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          safeSaveToken(null);
          safeSaveUser(null);
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

    safeSaveToken(authToken);
    safeSaveUser(loggedInUser);

    setToken(authToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    const { user: registeredUser, token: authToken } = res.data;

    safeSaveToken(authToken);
    safeSaveUser(registeredUser);

    setToken(authToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const updateUser = (updatedUser) => {
    safeSaveUser(updatedUser);
    setUser(updatedUser);
  };

  const logout = () => {
    safeSaveToken(null);
    safeSaveUser(null);
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, login, register, logout, updateUser }}>
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
