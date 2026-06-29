import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import LandingPage from './components/LandingPage/LandingPage';
import { useAuth } from './Context/AuthContext';
import { useNavigate } from "react-router-dom";
import RoleSwitcher from "./components/Demo/RoleSwitcher";

function RootLayout() {
  const { user, loginWithSSO, logout } = useAuth();
  const navigate = useNavigate();// Get the logged-in user status



  return (
    <div>
      {user ? (
        // Show the main layout if the user is logged in
        <>
          <NavBar />
          <div style={{ minHeight: "90vh" }}>
            <Outlet />
          </div>
          <Footer />
        </>
      ) : (
        // Show the Landing Page if the user is not logged in
        <LandingPage />
      )}
      <RoleSwitcher />
    </div>
  );
}

export default RootLayout;
