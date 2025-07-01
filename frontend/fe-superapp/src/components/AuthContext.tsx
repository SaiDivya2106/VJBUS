import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  login: () => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (value: boolean) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Trigger login modal
  const login = () => {
    setLoginModalOpen(true);
  };

  // Logout
  const logout = async () => {
    try {
      await fetch('https://auth.vjstartup.com/logout', {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  // Check auth on mount
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch('https://auth.vjstartup.com/check-auth', {
          method: 'GET',
          credentials: 'include', // Make sure this is present for cross-subdomain cookies
        });
        const data = await response.json();

        if (data.logged_in) {
          setIsAuthenticated(true);
          setUser(data.user); // backend should send user object
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed', err);
        setIsAuthenticated(false);
        setUser(null);
      }
    }

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        login,
        logout,
        isLoginModalOpen,
        setLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
