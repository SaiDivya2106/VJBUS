import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Define allowed emails (loaded from your .env file)
const allowedEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
const API_URL = "https://auth.vjstartup.com";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Token from localStorage is still useful for a quick client-side check
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 1. Client-side check: Decode token and check for admin email
        const decoded = jwtDecode(token);
        const email = decoded?.email;

        if (!email || !allowedEmails.includes(email)) {
          throw new Error(`Access Denied: ${email} is not an authorized admin.`);
        }

        // 2. Server-side check: Verify session via HttpOnly cookie
        const res = await fetch(`${API_URL}/check-auth`, {
          method: "GET",
          // This sends credentials (like cookies) with the request
          credentials: "include" 
        });
        
        if (!res.ok) {
          throw new Error("Server session validation failed. Please log in again.");
        }

        // If both checks pass, the user is valid
        setIsValid(true);

      } catch (error) {
        console.error("❌ Admin auth check failed:", error.message);
        localStorage.removeItem('adminToken'); // Clean up local token
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Run only once on component mount

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;