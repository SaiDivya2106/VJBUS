import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./NavBar.css";

const NavBar = () => {
  let navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth(); // Access the 'isAdmin' state

  const handleLogout = async () => {
    await logout(); // Log out the user/admin
    navigate("/complaints-website"); // Navigate to the login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="logo text-white" onClick={() => navigate("/complaints-website")}>
          THRIVE
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto mb-lg-0">
  {/* Show All Complaints only if user is logged in */}
  {user && (
    <li className="nav-item">
      <NavLink className="nav-link" to="/all-complaints">
        All Complaints
      </NavLink>
    </li>
  )}

  {/* Show My Complaints for both users and admins */}
  {user && (
    <li className="nav-item">
      <NavLink
        className="nav-link"
        to="/my-complaints"
        state={{ email: user.email }}
      >
        My Complaints
      </NavLink>
    </li>
  )}

  {/* Show Dashboard only if user is an admin */}
  {isAdmin && (
    <li className="nav-item">
      <NavLink className="nav-link" to="/adminpage">
        Dashboard
      </NavLink>
    </li>
  )}

  {/* Logout button if user/admin is logged in */}
  <li className="nav-item">
    {user || isAdmin ? (
      <NavLink
        className="nav-link"
        to="#"
        onClick={(e) => {
          e.preventDefault(); // prevent nav
          handleLogout();
        }}
      >
        Logout
      </NavLink>
    ) : (
      <NavLink className="nav-link" to="/complaints-website">
        Login
      </NavLink>
    )}
  </li>
</ul>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
