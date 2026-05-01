import { createContext, useEffect, useState } from 'react';
import { BsNutFill } from 'react-icons/bs';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(JSON.parse(storedUser).tokens || null);
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
        setUser(null);
        setToken(null);
      }
    }
  }, []);
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData.user));
    setToken(userData.user.tokens[0].token);
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, token }}>
      {children}
    </AuthContext.Provider>
  );
};
