import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const clientId = "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com";
const API_URL = "https://auth.vjstartup.com";

const allowedEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
console.log("allowed mails",allowedEmails)

const WrappedGoogleLoginButton = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      // Use the correctly imported function
      const decoded = jwtDecode(idToken);
      const email = decoded?.email;

      console.log("✅ Google ID Token received for:", email);

      if (!email || !allowedEmails.includes(email)) {
        const msg = `❌ Access denied: ${email} is not an authorized admin email.`;
        console.warn(msg);
        setMessage(msg);
        return;
      }

      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!res.ok) throw new Error("Login failed");
      const response = await res.json();
      localStorage.setItem('adminToken', response.token);
      navigate('/admin');
    } catch (error) {
      const msg = `❌ Login failed: ${error?.response?.data || error.message}`;
      console.error(msg);
      setMessage(msg);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ textAlign: 'center' }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setMessage("❌ Google Login Failed")}
        />
        {message && (
          <p style={{ marginTop: '1rem', color: 'red', fontWeight: 'bold' }}>
            {message}
          </p>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default WrappedGoogleLoginButton;