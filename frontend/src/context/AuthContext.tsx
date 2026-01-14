
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '../types';

interface AuthContextType {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  login: (user: Employee, token?: string) => void;
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
    const storedToken = localStorage.getItem('mesp_auth_token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        if (user.status === 'Actif') {
            setCurrentUser(user);
            setIsAuthenticated(true);
        } else {
            localStorage.clear();
        }
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: Employee, serverToken?: string) => {
    if (user.status !== 'Actif') {
        throw new Error("Compte inactif. Contactez l'administrateur.");
    }
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('mesp_user', JSON.stringify(user));
    
    // Si le serveur a renvoyé un token, on l'utilise, sinon on garde le token existant
    if (serverToken) {
      localStorage.setItem('mesp_auth_token', serverToken);
    } else if (!localStorage.getItem('mesp_auth_token')) {
      localStorage.setItem('mesp_auth_token', 'JWT_MOCK_' + Date.now());
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
