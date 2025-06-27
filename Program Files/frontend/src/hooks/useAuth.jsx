import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { 
  getToken, 
  setTokens, 
  removeTokens, 
  getUserFromToken, 
  isTokenValid, 
  setupTokenExpiryCheck,
  getDashboardRoute 
} from '../utils/auth';
import { userStorage } from '../utils/storage';
import { useNotification } from './useNotification';

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = getToken();
    const storedUser = userStorage.getUser();
    return token && isTokenValid(token) ? (getUserFromToken(token) || storedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getToken();
    return token ? isTokenValid(token) : false;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { notify } = useNotification();

  // Initialize user from token or storage
  const initializeAuth = useCallback(async () => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      try {
        // Verify token with server and get fresh user data
        const response = await authAPI.getProfile();
        const userData = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        userStorage.setUser(userData);
      } catch (error) {
        // Token is invalid, clear everything
        removeTokens();
        userStorage.removeUser();
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      // No valid token
      removeTokens();
      userStorage.removeUser();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken, user: userData } = response.data;
      
      setTokens(accessToken, refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      userStorage.setUser(userData);
      
      // Show success notification
      notify.loginSuccess(userData.name);
      
      // Navigate to appropriate dashboard
      const dashboardRoute = getDashboardRoute(userData.role);
      navigate(dashboardRoute);
      
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      notify.apiError(err);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [navigate, notify]);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      const { accessToken, refreshToken, user: newUser } = response.data;
      
      setTokens(accessToken, refreshToken);
      setUser(newUser);
      setIsAuthenticated(true);
      userStorage.setUser(newUser);
      
      // Show success notification
      notify.success(`Welcome to LearnHub, ${newUser.name}!`);
      
      // Navigate to appropriate dashboard
      const dashboardRoute = getDashboardRoute(newUser.role);
      navigate(dashboardRoute);
      
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      notify.apiError(err);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [navigate, notify]);

  // Logout function
  const logout = useCallback(async (showNotification = true) => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      removeTokens();
      userStorage.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      
      if (showNotification) {
        notify.logoutSuccess();
      }
      
      navigate('/login');
    }
  }, [navigate, notify]);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      userStorage.setUser(updatedUser);
      
      notify.success('Profile updated successfully');
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      notify.apiError(err);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [notify]);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await authAPI.changePassword(passwordData);
      notify.success('Password changed successfully');
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to change password';
      setError(errorMessage);
      notify.apiError(err);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [notify]);

  // Check if user has specific role
  const hasRole = useCallback((requiredRoles) => {
    if (!user || !user.role) return false;
    if (typeof requiredRoles === 'string') {
      return user.role === requiredRoles;
    }
    return requiredRoles.includes(user.role);
  }, [user]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Setup token expiry check
  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = setupTokenExpiryCheck(() => {
        notify.sessionExpired();
        logout(false);
      });
      return cleanup;
    }
  }, [isAuthenticated, logout, notify]);

 return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    initializeAuth
  };
};
