import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SubNavbar from './components/SubNavbar';
import HomePage from './pages/HomePage';
import SubmitPage from './pages/SubmitPage';
import ViewResponsesPage from './pages/ViewResponsePage.jsx';
import Login from './pages/Login';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Hero from "./components/Hero";
import Footer from './components/Footer'
import './styles/theme.css'
function App() {
  const [theme, setTheme] = useState("light");

  // Auto-detect system theme + load saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to <body> and store in localStorage
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="app">
        <NavigationBar />
        <SubNavbar />

        {/* Theme Toggle Button */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/responses" element={<ViewResponsesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <div style={{ textAlign: 'right', padding: '0.5rem 1rem' }}>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </div>
    </Router>
  );
}

export default App;