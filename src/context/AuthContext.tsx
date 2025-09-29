// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
// Assuming you have utility functions that store/retrieve/remove BOTH token AND role
// We will update '../utils/auth' functionality in the next step.
import { getToken, setToken, removeToken, getRole, setRole, removeRole } from '../utils/auth';

// Define the role type
export type UserRole = 'admin' | 'client' | null;

// Define the shape of our context state
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole; // <-- ADDED: User role state
  login: (token: string, role: UserRole) => void; // <-- MODIFIED: Accepts role
  logout: () => void;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null); // <-- NEW STATE
  const [loading, setLoading] = useState(true);

  // Check for persistent state (token and role) when the app loads
  useEffect(() => {
    const token = getToken();
    const role = getRole(); // <-- Get the stored role

    if (token && role) {
      // Assuming a valid token means the user is authenticated
      setIsAuthenticated(true);
      setUserRole(role as UserRole); // Set the role from storage
    }
    setLoading(false);
  }, []);

  // MODIFIED: Login now takes the user's role and persists it
  const login = (token: string, role: UserRole) => {
    if (role) {
      setToken(token);
      setRole(role); // <-- Persist the role
      setIsAuthenticated(true);
      setUserRole(role); // <-- Set the role state
    }
  };

  // MODIFIED: Logout now clears both token and role
  const logout = () => {
    removeToken();
    removeRole(); // <-- Remove the stored role
    setIsAuthenticated(false);
    setUserRole(null); // <-- Clear the role state
  };

  const value = {
    isAuthenticated,
    userRole, // <-- EXPOSED
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};