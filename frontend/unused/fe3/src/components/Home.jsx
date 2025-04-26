import React from 'react';

const Home = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/github';  // Redirect to backend for GitHub login
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the College App Manager</h1>
      <button onClick={handleLogin}>Login with GitHub</button>
    </div>
  );
};

export default Home;
