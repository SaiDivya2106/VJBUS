import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome {user ? user : "Guest"}!</h1>
            {user ? <LogoutButton /> : <p>Please log in to access more features.</p>}
        </div>
    );
};

export default Home;
