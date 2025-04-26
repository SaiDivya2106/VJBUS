import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://sso.vnrzone.site/sa-sso-be/api";  // ✅ SSO Backend  *** /sapp-be/api

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await login(username, password, redirectUrl);
        if (response) {
            window.location.href = redirectUrl;  // ✅ Redirect back to the original app
        } else {
            alert("Login failed!");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
    );
};

export default Login;
