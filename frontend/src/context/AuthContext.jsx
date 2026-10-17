import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('travelmate_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('travelmate_token');
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('travelmate_user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('travelmate_token');
          localStorage.removeItem('travelmate_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('travelmate_token', token);
    localStorage.setItem('travelmate_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('travelmate_token');
    localStorage.removeItem('travelmate_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('travelmate_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
