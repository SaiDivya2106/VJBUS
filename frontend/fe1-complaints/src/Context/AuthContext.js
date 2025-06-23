import React, { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCategory, setAdminCategory] = useState(null);
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://auth.vjstartup.com/check-auth", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.logged_in) {
          setUser(data.user);
          checkAdminStatus(data.user.email);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuth();
  }, []);


  const checkAdminStatus = async (email) => {
    try {
      const res = await fetch(`${baseUrl}/admin-api/check-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsAdmin(data.isAdmin);
      setAdminCategory(data.adminCategory);
      console.log("Admin status:", data.isAdmin, "Category:", data.adminCategory);
    } catch (err) {
      console.error("Error checking admin status:", err);
    }
  };

  const loginWithSSO = () => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error("Google Identity Services not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com",
      callback: async (response) => {
      


        const authenticateUser = async () => {
          const res = await fetch("https://auth.vjstartup.com/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ token: response.credential }),
          });

          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            checkAdminStatus(data.user.email);
  
          }
        };

        authenticateUser();
      },
      ux_mode: "popup",
    });

    window.google.accounts.id.prompt();
  };

  const logout = async () => {
    await fetch("https://auth.vjstartup.com/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setIsAdmin(false);
    setAdminCategory(null);
  };

  return (
    <AuthContext.Provider value={{ user,isAdmin, adminCategory, loginWithSSO, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
