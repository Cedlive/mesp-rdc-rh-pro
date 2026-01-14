
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '../types';

interface AuthContextType {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  login: (user: Employee) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mesp_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('mesp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: Employee) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('mesp_user', JSON.stringify(user));
    localStorage.setItem('mesp_auth_token', 'mock_token_' + Date.now());
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mesp_user');
    localStorage.removeItem('mesp_auth_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
