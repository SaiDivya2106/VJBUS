import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   // 🛠️ First define logout
   const logout = () => {
    setIsAuthenticated(false);
  };

  // Check if the user is authenticated based on the presence of the userToken cookie
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch('https://auth.vjstartup.com/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.logged_in) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth check failed', err);
        setIsAuthenticated(false);
      }
    }
  
    checkAuthStatus();
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
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
