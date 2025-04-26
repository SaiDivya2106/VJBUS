import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Failure() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);  

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="fail-info"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#ffe6e6',
        color: '#cc0000',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <div className="exam">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Login Failed..!</h1>
        <p style={{ fontSize: '1.2rem' }}>Redirecting to the homepage in 3 seconds...</p>
        <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
          If it doesn't redirect, <Link to="/" style={{ color: '#cc0000', textDecoration: 'underline' }}>click here</Link>.
        </p>
      </div>
    </div>
  );
}

export default Failure;
