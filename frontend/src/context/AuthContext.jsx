import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodiehub_user') || 'null');
    } catch {
      localStorage.removeItem('foodiehub_user');
      localStorage.removeItem('foodiehub_token');
      return null;
    }
  });

  const saveSession = (data) => {
    localStorage.setItem('foodiehub_token', data.token);
    localStorage.setItem('foodiehub_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const login = async (credentials) => saveSession((await api.post('/auth/login', credentials)).data);
  const register = async (details) => saveSession((await api.post('/auth/register', details)).data);
  const logout = () => {
    localStorage.removeItem('foodiehub_token');
    localStorage.removeItem('foodiehub_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
};
