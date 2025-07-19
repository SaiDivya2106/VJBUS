import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token,checkLoginStatus } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://auth.vjstartup.com/check-auth`, {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          // cache: "no-store",
          credentials: "include",
        });
        // const res = await checkLoginStatus();
        console.log("at the protected route res:",res)
        const data =await res.json();

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;

