import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const ProtectedPage = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            const currentPage = window.location.pathname;
            navigate(`/login?redirect=${encodeURIComponent(currentPage)}`);
        }
    }, [loading, user, navigate]);

    if (loading) return <p>Checking authentication...</p>;

    return user ? (
        <div>
            <h1>Welcome, {user}!</h1>
            <button onClick={() => logout().then(() => navigate("/login"))}>Logout</button>
        </div>
    ) : null;
};

export default ProtectedPage;
