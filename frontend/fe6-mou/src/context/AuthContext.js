import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);

  // Auth Server URL
  const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:2999';

  const checkAuth = React.useCallback(async () => {
    try {
      const response = await axios.get(`${AUTH_URL}/check-auth`, {
        withCredentials: true
      });
      if (response.data.logged_in && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [AUTH_URL]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginWithGoogle = async (token) => {
    try {
      const response = await axios.post(`${AUTH_URL}/auth/google`, { token }, {
        withCredentials: true
      });
      if (response.data.user) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Google login failed:", error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${AUTH_URL}/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
  };

  const value = {
    user,
    login: loginWithGoogle, // Replaced email login with Google login handler
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
