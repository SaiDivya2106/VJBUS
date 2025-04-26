// import React, { createContext, useContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [needsLogin, setNeedsLogin] = useState(false);

//   useEffect(() => {
//     console.log("AuthContext: Checking for user token...");

//     const storedToken = Cookies.get("token");
//     const storedUser = Cookies.get("user");

//     console.log("Stored Token:", storedToken);
//     console.log("Stored User (Raw):", storedUser);

//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         console.log("Parsed User:", parsedUser);
//         setUser(parsedUser);

//         if (storedToken) {
//           setToken(storedToken);
//         }
//       } catch (error) {
//         console.error("Failed to parse user data from cookies:", error);
//         Cookies.remove("user");
//         Cookies.remove("token"); // Clear token as well if parsing fails
//         setNeedsLogin(true);
//       }
//     } else {
//       console.log("AuthContext: No user found. Showing login message...");
//       Cookies.remove("token"); // Remove token if user is missing
//       setNeedsLogin(true);
//     }

//     setLoading(false);
//   }, []);

//   const logout = () => {
//     console.log("AuthContext: Logging out user...");
//     Cookies.remove("token");
//     Cookies.remove("user");
//     setToken(null);
//     setUser(null);
//     setNeedsLogin(true);
//   };

//   if (loading) return <div>Loading...</div>;

//   if (needsLogin) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
//         <h2>🚀 Please login from SuperApp</h2>
//         <p>Once logged in, refresh this page.</p>
//         <button
//           onClick={() => (window.location.href = "https://superapp.vnrzone.site/")}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginTop: "15px",
//           }}
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={{ user, token, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

/////////////////////////////**********the above code is AuthContext to use superApp*************
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email && parsedUser.email.endsWith("@vnrvjiet.in")) {
          setUser(parsedUser);
        } else {
          Cookies.remove("user");
        }
      } catch (error) {
        Cookies.remove("user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => console.error("Failed to load Google script");
    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = (response) => {
    try {
      const decoded = decodeJwt(response.credential);
      if (!decoded) {
        alert("Failed to decode token");
        return;
      }
      
      const { 
        email, 
        name, 
        given_name, 
        family_name, 
        picture, 
        sub: googleId, 
        email_verified 
      } = decoded;

      if (!email || !email.endsWith("@vnrvjiet.in")) {
        alert("Access restricted to @vnrvjiet.in domain only.");
        return;
      }

      const userData = {
        email,
        name: name || `${given_name || ""} ${family_name || ""}`.trim(),
        firstName: given_name,
        lastName: family_name,
        picture,
        googleId,
        emailVerified: email_verified,
        domain: email.split('@')[1]
      };

      setUser(userData);
      console.log("user",userData);
      Cookies.set("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error handling credential response:", error);
    }
  };

  useEffect(() => {
    if (!user && scriptLoaded && googleButtonRef.current && window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        { 
          theme: "filled_blue", 
          size: "large",
          shape: "pill",
          logo_alignment: "center",
          width: 300
        }
      );
    }
  }, [user, scriptLoaded]);

  const logout = () => {
    Cookies.remove("user");
    setUser(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-xl text-gray-700">
      Loading...
    </div>
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
        <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Welcome to Easyfind</h1>
            <p className="text-gray-600">Please sign in with your institutional email</p>
          </div>
          <div className="flex justify-center mb-6" ref={googleButtonRef}></div>
        </div>
      </div>
    );
  }
  
  

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};







// // temporary changes"
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef
// } from "react";

// const AuthContext = createContext(null);

// // ✅ Constants
// const API_URL = "https://auth.vnrzone.site";

// // ✅ AuthProvider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const googleButtonRef = useRef(null);

//   // ✅ Load Google Identity Script
//   useEffect(() => {
//     if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
//       setScriptLoaded(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     script.onload = () => setScriptLoaded(true);
//     script.onerror = () => console.error("Failed to load Google script");
//     document.body.appendChild(script);
//   }, []);

//   // ✅ Check login status on mount
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const res = await fetch(`${API_URL}/check-auth`, {
//           method: "GET",
//           credentials: "include"
//         });

//         const data = await res.json();

//         if (data.logged_in) {
//           setUser(data.user);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error("Error checking login status:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   // ✅ Handle Google login
//   const handleCredentialResponse = async (response) => {
//     try {
//       const idToken = response.credential;

//       const res = await fetch(`${API_URL}/auth/google`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: idToken }),
//         credentials: "include"
//       });

//       const data = await res.json();

//       if (data.user) {
//         setUser(data.user);
//       } else {
//         alert("Login failed. Try again.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//     }
//   };

//   // ✅ Initialize Google login
//   useEffect(() => {
//     if (!user && scriptLoaded && googleButtonRef.current && window.google) {
//       window.google.accounts.id.initialize({
//         client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//         callback: handleCredentialResponse,
//         ux_mode: "popup"
//       });

//       window.google.accounts.id.renderButton(googleButtonRef.current, {
//         theme: "filled_blue",
//         size: "large",
//         shape: "pill",
//         logo_alignment: "center",
//         width: 300
//       });
//     }
//   }, [user, scriptLoaded]);

//   // ✅ Logout handler
//   const logout = async () => {
//     try {
//       await fetch(`${API_URL}/logout`, {
//         method: "POST",
//         credentials: "include"
//       });
//       setUser(null);
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   // ✅ Loading UI
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-xl text-gray-700">
//         Loading...
//       </div>
//     );
//   }

//   // ✅ Show login screen if not authenticated
//   if (!user) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
//         <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md text-center">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-blue-600 mb-2">Welcome to Easyfind</h1>
//             <p className="text-gray-600">Please sign in with your institutional email</p>
//           </div>
//           <div className="flex justify-center mb-6" ref={googleButtonRef}></div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Authenticated UI
//   return (
//     <AuthContext.Provider value={{ user, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ useAuth Hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
