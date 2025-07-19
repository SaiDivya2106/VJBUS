import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const { loginWithGoogle,logout } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("✅ ID Token:", credentialResponse.credential);

      // Call login function from context
      await loginWithGoogle(credentialResponse.credential);

      // Navigate to protected route after login
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
    }
  };

  return (<div>
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.error("❌ Login Failed");
      }}
    />
    <button className="btn-secondary" onClick={()=>logout()}>logout</button>
    </div>
    
  );
};

export default GoogleLoginButton;

