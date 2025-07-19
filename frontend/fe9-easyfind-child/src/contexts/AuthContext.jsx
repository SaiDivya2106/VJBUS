import React, { createContext, useContext, useEffect, useState } from "react";

// ✅ Dynamic backend URL (localhost vs production)
const API_URL = "https://auth.vjstartup.com";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token,setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if user is logged in
  const checkLoginStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        credentials: "include",
      });
      // return res;
       const data = await res.json();
      console.log("at the check login status res:",data)
      if (data.logged_in) {

       
       console.log("logged in");

        setUser(data.user);
        // setToken(data.token)
      } else {
        console.log("not logged in")
        setUser(null);
        setToken(null)
      }
      return data;
    } catch (err) {
      console.error("check-auth failed (likely no cookie yet):", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Called when user logs in with Google
  const loginWithGoogle = async (idToken) => {
    try {
      console.log("reached login with google",idToken)
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log(data);
      setUser(data.user);
      setToken(data.token)
      localStorage.setItem("token",data.token);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // useEffect(() => {
  //   checkLoginStatus();
  // }, []);
  // useEffect(() => {
  // const stored = localStorage.getItem("userToken");
  // if (stored) {
  //   setToken(stored);
  //  }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading,checkLoginStatus,token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
