
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/kanban';
import * as localStorageService from '@/services/localStorage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    const currentUser = localStorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const authenticatedUser = localStorageService.authenticateUser(username, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (username: string, password: string): boolean => {
    // Check if username already exists
    const users = localStorageService.getUsers();
    if (users.some(u => u.username === username)) {
      return false;
    }

    const newUser = localStorageService.createUser(username, password);
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorageService.logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
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