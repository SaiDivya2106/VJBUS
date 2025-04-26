// const clientId = "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com"; 

import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";

const clientId = "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com"; 

const Login = ({ onLoginSuccess }) => {
    const handleLoginSuccess = (response) => {
        console.log("Login Success:", response);
        const idToken = response.credential;
        authenticateUser(idToken);
    };

    const authenticateUser = async (idToken) => {
        try {

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });
            const data = await res.json();

            if (data.token) {
                const isProduction = import.meta.env.MODE === "production"; // ✅ Detect environment
                Cookies.set("userToken", data.token, {
                    domain: import.meta.env.VITE_APP_COOKIE_DOMAIN,
                    path: "/",
                    secure: isProduction,  // ✅ Secure only in production
                    sameSite: "Lax"
                });

                Cookies.set("user", JSON.stringify(data.user), {
                    domain: import.meta.env.VITE_APP_COOKIE_DOMAIN,
                    path: "/",
                    secure: isProduction,  // ✅ Secure only in production
                    sameSite: "Lax"
                });

                onLoginSuccess(data.user);
            }
        } catch (error) {
            console.error("Authentication Error:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
