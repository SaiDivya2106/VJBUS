import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://superapp.vnrzone.site/sa-sso-be/api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/check-login`, { withCredentials: true })
            .then(response => {
                if (response.data.logged_in) {
                    setUser(response.data.user);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (username, password, redirectUrl) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password, redirect_url: redirectUrl }, { withCredentials: true });
            if (response.data.success) {
                setUser(username);
                return response.data.redirect;
            }
        } catch (error) {
            console.error("Login failed", error);
        }
        return null;
    };

    const logout = async () => {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
