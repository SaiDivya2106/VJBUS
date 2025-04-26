import React from "react";

const Dashboard = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <img src={user.picture} alt="Profile" width="100" />
      <p>Email: {user.email}</p>
      <button onClick={() => {
        localStorage.removeItem("userToken"); // Clear token on logout
        window.location.reload(); // Refresh page to reset authentication state
      }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
