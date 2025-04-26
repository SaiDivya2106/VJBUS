import React, { useEffect, useState } from "react";

const API_URL = "https://auth.vnrzone.site";

function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => initializeGoogleLogin();
        document.body.appendChild(script);
      } else {
        initializeGoogleLogin();
      }
    };

    const initializeGoogleLogin = () => {
      window.google.accounts.id.initialize({
        client_id: "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(
        document.getElementById("login-btn"),
        { theme: "outline", size: "large" }
      );

      checkLoginStatus();
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.logged_in) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
      setUser(null);
      document.cookie = "userToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <div id="login-btn"></div>
        </div>
      )}
    </div>
  );
}

export default Login;
