import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { GraduationCap, User, LogIn } from 'lucide-react';
import LoginModal from './LoginModal';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPicture, setUserPicture] = useState('');
  

  useEffect(() => {
    async function checkUserDetails() {
      try {
        const response = await fetch('https://auth.vjstartup.com/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log("🔍 /check-auth response:", data);
  
        if (data.logged_in && data.user) {
          setIsLoggedIn(true);
          setUsername(data.user.name);
          setUserEmail(data.user.email);
          setUserPicture(data.user.picture || '');
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    }
  
    checkUserDetails();
  }, []);
  

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('https://auth.vjstartup.com/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      setUsername('');
      setUserEmail('');
      setUserPicture('');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="bg-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap size={32} className="text-yellow-300" />
            <div>
              <h1 className="text-2xl font-bold">VNRVJIET Super App</h1>
              <p className="text-xs text-indigo-200">All college services in one place</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {userPicture ? (
                  <img src={userPicture} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={24} />
                )}
                <div className="text-sm">
                  <div>{username}</div>
                  <div className="text-xs text-indigo-200">{userEmail}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm"
              >
                <LogIn className="mr-1" size={18} />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={() => window.location.reload()} />
      )}
    </header>
  );
};

export default Header;
