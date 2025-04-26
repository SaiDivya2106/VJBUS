import React, { useEffect, useState } from 'react';
import { fetchAuthStatus, logout } from './auth-utils';

const Header = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    picture?: string;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authUser = await fetchAuthStatus();
      if (authUser.isAuthenticated) {
        setUser({
          name: authUser.name,
          email: authUser.email,
          picture: authUser.picture,
        });
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-700">VNR Super App 🚀</h1>
      {user ? (
        <div className="flex items-center space-x-4">
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm text-gray-700">
            <div>{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <button
            onClick={logout}
            className="ml-4 px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="https://demo1.vnrzone.site" // Redirect to demo1 for login
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
        >
          Login with Google
        </a>
      )}
    </header>
  );
};

export default Header;
