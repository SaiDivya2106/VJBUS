import React from 'react';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
      <p className="mt-2">You are successfully logged in via GitHub OAuth.</p>
    </div>
  );
};

export default Profile;
