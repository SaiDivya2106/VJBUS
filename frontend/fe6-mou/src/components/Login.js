import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

function Login() {
  const [error, setError] = useState('');
  const { login } = useAuth(); // login is now loginWithGoogle

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (credentialResponse.credential) {
        const result = await login(credentialResponse.credential);
        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google Login Failed');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📋 MoU Management System</h1>
          <p>Vignana Jyothi Institute of Engineering and Technology</p>
        </div>

        <div className="login-actions">
          {error && <div className="error-message">{error}</div>}

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
              shape="pill"
              text="signin_with"
            />
          </div>

          <div className="login-info">
            <p className="info-text">
              Please sign in with your VNRVJIET email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
