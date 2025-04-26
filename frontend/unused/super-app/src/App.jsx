import React, { useState, useEffect } from "react";
import Login from "./Login";
import SuperAppContent from "./SuperAppContent";
import Cookies from "js-cookie";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // ✅ Load user from cookies
        const storedUser = Cookies.get("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div>
            <SuperAppContent user={user} />
        </div>
    );
};

export default App;
