import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (token: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (fullName: string) => Promise<boolean>;
  reloadProfile: () => Promise<boolean>;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user details if JWT exists in local storage
  const loadUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setToken(storedToken);
      const res = await api.get('/users/profile');
      if (res.data.success) {
        setUser(res.data.data);
        setIsAuthenticated(true);
      } else {
        // Token is invalid/expired
        logout();
      }
    } catch (err: any) {
      console.error('Error loading user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Login Handler
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const userToken = res.data.token;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(res.data.data);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  // Register Handler
  const register = async (
    fullName: string,
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { fullName, username, email, password });
      if (res.data.success) {
        const userToken = res.data.token;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(res.data.data);
        setIsAuthenticated(true);
      }
      setLoading(false);
      return {
        success: res.data.success,
        message: res.data.message || 'Registration successful.',
      };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Verify Email Handler
  const verifyEmail = async (verificationToken: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/verify-email', { token: verificationToken });
      if (res.data.success) {
        const userToken = res.data.token;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(res.data.data);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email verification failed.');
      setLoading(false);
      return false;
    }
  };

  // Logout Handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setLoading(false);
  };

  // Update Profile Handler
  const updateProfile = async (fullName: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await api.put('/users/profile', { fullName });
      if (res.data.success) {
        setUser(res.data.data);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      return false;
    }
  };

  // Reload Profile Handler
  const reloadProfile = async (): Promise<boolean> => {
    try {
      const res = await api.get('/users/profile');
      if (res.data.success) {
        setUser(res.data.data);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Clear errors
  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        verifyEmail,
        logout,
        updateProfile,
        reloadProfile,
        clearErrors,
      }}
    >
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
