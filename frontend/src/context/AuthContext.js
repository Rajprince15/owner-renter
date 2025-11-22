import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginAPI, logout as logoutAPI, register as registerAPI } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      const { token: newToken, user: newUserData } = response.data;
      
      setToken(newToken);
      setUser(newUserData);
      setIsAuthenticated(true);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};