import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMe(token)
        .then((res) => {
          if (res.success) setUser(res.user);
          else logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}