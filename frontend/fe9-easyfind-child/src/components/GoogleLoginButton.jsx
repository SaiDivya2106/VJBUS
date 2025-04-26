import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleLoginButton = () => {
  const { loginWithGoogle, handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Wrap the callback logic so it won't be re-created on every render
  const handleCallback = useCallback(async (token, userData) => {
    setLoading(true);
    try {
      console.log("Before handleGoogleCallback");
      await handleGoogleCallback(token, userData);
      console.log("After handleGoogleCallback");
      // Navigate and replace the history so that query parameters are cleared
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.log("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleGoogleCallback, navigate]);

  useEffect(() => {
    // If a token is already stored (i.e. user is already logged in), navigate to dashboard.
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userData = params.get('userData');
    const errorMsg = params.get('error');

    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
    }

    if (token && userData) {
      console.log("Processing OAuth callback from URL");
      handleCallback(token, userData);
    }
  }, [location.search, handleCallback, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">EasyFind</h1>
          <p className="text-gray-600 text-sm">Lost and Found Platform123</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.9 0 7.1 1.4 9.6 3.6l7.1-7.1C36.1 2.1 30.5 0 24 0 14.6 0 6.6 5.4 2.7 13.3l8.3 6.5C13.1 13.1 18.1 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.6H24v9.1h12.7c-.6 3.1-2.4 5.7-4.9 7.4l7.6 5.9c4.4-4.1 7.1-10.2 7.1-17.8z" />
                <path fill="#FBBC05" d="M12.7 28.7c-1.1-3.1-1.1-6.5 0-9.6L4.4 12.6C1.6 17.3 0 22.5 0 28s1.6 10.7 4.4 15.4l8.3-6.5z" />
                <path fill="#EA4335" d="M24 48c6.5 0 12.1-2.1 16.1-5.7l-7.6-5.9c-2.1 1.4-4.7 2.3-7.6 2.3-5.9 0-10.9-3.6-12.7-8.7l-8.3 6.5C6.6 42.6 14.6 48 24 48z" />
              </svg>
              <span className="font-medium text-gray-700">Continue with Google</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Please use your <span className="font-medium text-gray-700">college email</span>
        </p>
      </div>
    </div>
  );
};

export default GoogleLoginButton;
