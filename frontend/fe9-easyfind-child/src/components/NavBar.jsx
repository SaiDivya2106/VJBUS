import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Search, AlertCircle, Home, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { path: '/dashboard/home', icon: Home, label: 'Home' },
  { path: '/dashboard/report-item', icon: AlertCircle, label: 'Report Item' },
  { path: '/dashboard/lost-item', icon: Bell, label: 'Lost Item?' },
  { path: '/dashboard/search-item', icon: Search, label: 'Search Item' },
  { path: '/dashboard/user-profile', icon: User, label: 'User Profile' },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);

  // Responsive handling
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  // Close menu on Escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  };

  // Smooth navigation
  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-white shadow-md">
      <h1 
        className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate('/dashboard/home')}
      ><img 
         src="https://res.cloudinary.com/dxql68kht/image/upload/fl_preserve_transparency/v1744206896/Screenshot_2025-04-09_191750_kml7qq.jpg?_s=public-apps" 
         alt="Logo" 
         className="h-10 w-auto" 
 />
   </h1>

      {user && (
        <div className="relative" ref={menuRef}>
          {isMobile ? (
            <button 
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={24} />
            </button>
          ) : (
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          )}

          {/* Mobile Menu */}
          {menuOpen && isMobile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden">
              <div className="absolute right-0 top-16 w-full max-w-xs h-[calc(100vh-4rem)] bg-white shadow-xl p-4 transform transition-transform">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                  <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg mt-2"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;