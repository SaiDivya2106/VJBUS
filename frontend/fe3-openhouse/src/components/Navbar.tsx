import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { User } from '../App';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  currentRoute: string;
  onGoogleCredentialResponse: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

function Navbar({ currentRoute, onGoogleCredentialResponse, user, setUser }: NavbarProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const result = fetch(`${import.meta.env.VITE_AUTH_SERVER_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          console.error('Logout request failed');
        }
      })
      .catch(error => {
        console.error('Logout request error:', error);
      });

    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    setUser(null);
    setMobileMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <GraduationCap className="icon" />
          <h1 className="title">OpenHouse VNRVJIET</h1>
        </div>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </button>

        <div className={`navbar-links-container ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            {user && (
              <div className="user-info">
                <img src={user.picture} alt={user.name} className="avatar" />
                <span className="user-name">{user.name}</span>
              </div>
            )}


            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Projects
            </Link>
            <Link to="/myprojects" className={location.pathname === '/myprojects' ? 'active' : ''}>
              My Projects
            </Link>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/upload">
              <button className="submit-button">Submit Project</button>
            </Link>

            {!user && <Link to="/" className="login-link">Login</Link>}

            {user && (
              <button onClick={handleLogout} className="logout-button logout-mobile mb-4">
                Logout
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
