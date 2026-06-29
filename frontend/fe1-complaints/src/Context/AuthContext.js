import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { isExperimental } from "../utils/isExperimental";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAssistant, setIsAssistant] = useState(false);
  const [adminCategory, setAdminCategory] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTimeout, setRefreshTimeout] = useState(null);

  // Experimental Mode State
  const [demoRole, setDemoRole] = useState(localStorage.getItem("demoRole") || "student");

  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;
  const authServerUrl = process.env.REACT_APP_AUTH_SERVER_URL || "http://localhost:2999";

  useEffect(() => {
    // Attach token globally and keep interceptor ids so we can eject them on cleanup
    const reqInterceptorId = axios.interceptors.request.use((config) => {
      // allow callers to explicitly skip auth (e.g., public uploads)
      if (config && config._skipAuth) return config;

      // don't attach cookies to third-party upload endpoints (Cloudinary)
      const url = config && config.url ? config.url.toString() : "";
      const skipHosts = ["api.cloudinary.com", "res.cloudinary.com"];
      if (skipHosts.some((h) => url.includes(h))) return config;

      // Auth now relies on HttpOnly cookie from auth-server
      config.withCredentials = true;
      config._hasAuth = true;

      // 🔓 EXPERIMENTAL MODE HEADER
      if (isExperimental) {
        config.headers['x-demo-role'] = localStorage.getItem("demoRole") || "student";
      }

      return config;
    });

    // Handle token expiry globally
    const resInterceptorId = axios.interceptors.response.use(
      // Success handler: catch cases where authenticated requests unexpectedly return no body
      (response) => {
        try {
          const wasAuth = response?.config?._hasAuth;
          // If an authenticated request returned no data or 204, consider token/session failure
          if (wasAuth && (response.status === 204 || response.data == null)) {
            console.warn("⛔ Authenticated request returned empty — forcing logout");
            // Force logout and redirect, but reject so component-level catch handlers execute
            logout();
            window.location.href = "/complaints-website";
            return Promise.reject({ message: "Empty authenticated response", response });
          }
        } catch (e) {
          // ignore
        }
        return response;
      },
      (error) => {
        const status = error?.response?.status;

        // Force logout on common auth-related status codes
        if ([401, 403, 419, 440].includes(status)) {
          if (isExperimental) return Promise.reject(error); // Don't force logout in demo mode usually

          console.log("⛔ Token/session failure detected (status)");
          logout();
          window.location.href = "/complaints-website";
          return Promise.reject(error);
        }

        // Network or CORS failures (no response) for authenticated requests
        const wasAuthReq = error?.config?._hasAuth;
        if (!error.response && wasAuthReq) {
          console.log("⛔ Network/CORS error on authenticated request — forcing logout");
          logout();
          window.location.href = "/complaints-website";
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptorId);
      axios.interceptors.response.eject(resInterceptorId);
    };
  }, []);



  // --- Decode JWT ---
  const decodeJwt = (token) => JSON.parse(atob(token.split(".")[1]));

  // --- Schedule refresh ---
  const scheduleTokenRefresh = (token) => {
    if (!token) return;
    const { exp } = decodeJwt(token);
    const expiresIn = exp * 1000 - Date.now();
    const refreshTime = expiresIn - 2 * 60 * 1000;

    if (refreshTimeout) clearTimeout(refreshTimeout);
    if (refreshTime <= 0) return;

    const timeout = setTimeout(async () => {
      const refreshed = await silentRefreshToken();
      if (refreshed) scheduleTokenRefresh(localStorage.getItem("authToken"));
    }, refreshTime);

    setRefreshTimeout(timeout);
  };

  // --- Handle login response ---
  const handleGoogleResponse = async (response) => {
    if (!response.credential) return;
    const idToken = response.credential;

    localStorage.setItem("authToken", idToken);
    setAuthToken(idToken);
    scheduleTokenRefresh(idToken);

    try {
      const res = await fetch(`${authServerUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: idToken }),
      });

      if (!res.ok) {
        throw new Error("Access denied");
      }

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        checkAdminStatus(data.user.email);
      }
    } catch (err) {
      console.error("Login failed:", err);
      logout(); // clear bad token if access denied
    }
  };

  // --- Initialize Google ---
  const initializeGoogle = () => {
    if (isExperimental) return; // Skip in demo mode

    if (!window.google?.accounts?.id || window.googleInitialized) return;

    window.google.accounts.id.initialize({
      client_id:
        "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com",
      callback: handleGoogleResponse,
      auto_select: false,
    });

    window.googleInitialized = true;
    showLoginButton();
  };

  // --- Silent refresh ---
  const silentRefreshToken = () =>
    new Promise((resolve) => {
      if (isExperimental) return resolve(true);

      if (!window.google?.accounts?.id) return resolve(false);
      initializeGoogle();

      let done = false;
      const finish = (success) => {
        if (!done) {
          done = true;
          resolve(success);
        }
      };

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          showLoginButton();
        }
      }, { select_account: true });

      setTimeout(() => finish(false), 3000);
    });

  // --- Check admin ---
  const checkAdminStatus = async (email) => {
    try {
      if (isExperimental) {
        // In demo mode, we simulate the response based on the role
        const currentRole = localStorage.getItem("demoRole") || "student";
        if (currentRole === 'admin') {
          setIsAdmin(true);
          setIsAssistant(false);
          setAdminCategory(["Mess"]);
          return;
        }
        if (currentRole === 'assistant') {
          setIsAdmin(true);
          setIsAssistant(true);
          setAdminCategory(["Hostel"]);
          return;
        }
        if (currentRole === 'superadmin') {
          setIsAdmin(true);
          // Superadmin usually has access to everything or specific flag
          // For this app logic, let's just say they are admin + super logic handled elsewhere
          setIsAssistant(false);
          setAdminCategory(["Mess", "Hostel"]);
          return;
        }
        // student
        setIsAdmin(false);
        setIsAssistant(false);
        setAdminCategory([]);
        return;
      }

      const token = localStorage.getItem("authToken");

      const res = await fetch(`${baseUrl}/admin-api/check-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ REQUIRED
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(`Admin check failed: ${res.status}`);
      }

      const data = await res.json();
      setIsAdmin(data.isAdmin);
      setIsAssistant(data.isAssistant || false);
      setAdminCategory(
        data.isAdmin
          ? Array.isArray(data.adminCategories)
            ? data.adminCategories
            : [data.adminCategory].filter(Boolean)
          : []
      );
    } catch (err) {
      console.error("Error checking admin:", err);
    }
  };

  // --- Switch demo role ---
  const switchRole = (role) => {
    localStorage.setItem("demoRole", role);
    setDemoRole(role);

    // Update admin status based on role
    if (role === 'admin') {
      setIsAdmin(true);
      setIsAssistant(false);
      setAdminCategory(["Mess"]);
    } else if (role === 'assistant') {
      setIsAdmin(true);
      setIsAssistant(true);
      setAdminCategory(["Hostel"]);
    } else if (role === 'superadmin') {
      setIsAdmin(true);
      setIsAssistant(false);
      setAdminCategory(["Mess", "Hostel"]);
    } else {
      // student
      setIsAdmin(false);
      setIsAssistant(false);
      setAdminCategory([]);
    }
  };

  // --- Render Google login button ---
  const showLoginButton = () => {
    if (isExperimental) return; // No login button in demo mode

    if (!window.google?.accounts?.id) return;
    const div = document.getElementById("googleLoginDiv");
    if (!div) return;

    div.innerHTML = ""; // clear old
    window.google.accounts.id.renderButton(div, {
      theme: "outline",
      size: "large",
      type: "standard",
    });
  };

  // --- Login trigger ---
  const loginWithSSO = () => {
    if (isExperimental) return; // No SSO in demo mode

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt({ select_account: true });
    } else {
      console.warn("Google not initialized yet");
    }
  };

  // --- Logout ---
  const logout = async () => {
    if (isExperimental) {
      localStorage.removeItem("demoRole");
      setUser(null);
      setIsAdmin(false);
      setIsAssistant(false);
      setAdminCategory(null);
      window.location.reload();
      return;
    }

    if (refreshTimeout) clearTimeout(refreshTimeout);

    await fetch(`${authServerUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setIsAdmin(false);
    setIsAssistant(false);
    setAdminCategory(null);
    localStorage.removeItem("authToken");
    setAuthToken(null);

    const div = document.getElementById("googleLoginDiv");
    if (div) div.innerHTML = "";
    setTimeout(() => showLoginButton(), 50);
  };


  // --- Inject Google script ---
  useEffect(() => {
    if (isExperimental) {
      // Init Demo User ONLY if role exists
      const role = localStorage.getItem("demoRole");
      if (role) {
        switchRole(role);
      }
      setLoading(false);
      return;
    }

    const loadGoogleScript = () => {
      if (document.getElementById("google-js")) {
        initializeGoogle();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-js";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    };

    loadGoogleScript();

    const initAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const { exp } = decodeJwt(token);
          if (Date.now() >= exp * 1000) {
            const refreshed = await silentRefreshToken();
            if (!refreshed) {
              showLoginButton();
              return;
            }
          } else {
            scheduleTokenRefresh(token);
          }
        }

        const res = await fetch(`${authServerUrl}/check-auth`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.logged_in) {
          setUser(data.user);
          checkAdminStatus(data.user.email);
        } else {
          // Clear localStorage and user state if session is invalid
          setUser(null);
          setIsAdmin(false);
          setAdminCategory(null);
          localStorage.removeItem("authToken");
          setAuthToken(null);
          showLoginButton();
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        showLoginButton();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAssistant,
        adminCategory,
        loginWithSSO,
        logout,
        authToken,
        loading,
        switchRole, // 👈 New
        isExperimental // 👈 New
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
