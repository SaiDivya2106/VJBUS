import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";

const App = ({ appName }) => {
    const [user, setUser] = useState(null);
    const [redirectCountdown, setRedirectCountdown] = useState(10);
    const isInIframe = useMemo(() => window.self !== window.top, []);

    useEffect(() => {
        // ✅ Load user from cookies
        const storedUser = Cookies.get("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (!isInIframe) {
            console.log("Redirecting to SuperApp...");
            const interval = setInterval(() => {
                setRedirectCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            // ✅ Redirect after 10 seconds
            const timeout = setTimeout(() => {
                window.location.href = "https://superapp.vnrzone.site/";
            }, 10000);

            return () => {
                clearTimeout(timeout);
                clearInterval(interval);
            };
        }
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {user ? (
                <>
                    <h1>Welcome to {appName}</h1>
                    <h3>The app has access to below data to use</h3>
                    <img src={user.picture} alt="User Profile" width="80" style={{ borderRadius: "50%" }} />
                    <p>Email: {user.email}</p>
                    <p>Name: {user.name}</p>
                </>
            ) : isInIframe ? (
                <div>
                    <h2>🛑 Please Sign in from SuperApp</h2>
                    <h3>Then click on "SuperApp" to reload.</h3>
                </div>
            ) : (
                <div>
                    <h2>🚀 Login required! Please Sign in from SuperApp and come back...</h2>
                    <h3>Redirecting you in {redirectCountdown} seconds...</h3>
                </div>
            )}
        </div>
    );
};

export default App;
