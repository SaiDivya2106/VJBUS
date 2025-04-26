import React from 'react';
import './Home.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { faHandPaper, faHandPointUp } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import animationData from '../../../src/animations/search.json';
import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';

const text = 'Project Hub';

const LetterRotator = () => {
  return (
    <div className="letter-rotator">
      {text.split('').map((letter, index) => (
        <span key={index} className="letter">
          {letter}
        </span>
      ))}
    </div>
  );
};

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Fetching user data from Redux
  const user = useSelector((state) => state.User.currentUser);
  const login = !!user; // Check if user exists (logged in)

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/projects?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="home-container">
      <div className="card">
        <div className="background-image"></div>
        <div className="gradient-overlay"></div>
        <div className="card-img-overlay">
          {/* Display username if logged in */}
          {login && user?.name && (
            <div style={{ position: 'absolute', top: '23px', right: '10px', fontSize: '18px' }}>
              <div className="username-animate w-100 pb-2">
                <FontAwesomeIcon icon={faHandPaper} className="hand-icon m-1" /> Hi, {user.name}
              </div>
            </div>
          )}

          <div className="search-page d-flex justify-content-center">
            <div>
              <div><Outlet /></div>
              <div>VNRVJIET</div>
            </div>
            <LetterRotator />
            <p className="quote">Find, Learn, and Inspire with College Projects</p>
            <div className="container-fluid">
              <form className="d-flex mx-auto search-form" role="search" onSubmit={handleSearchSubmit}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />

                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    className={`btn btn-outline-success text-white ${isHovered ? 'bg-white text-success' : 'bg-success'}`}
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      width: '150px', 
                      height: '50px',
                      position: 'relative', 
                      overflow: 'hidden',
                      display: 'flex', 
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {!isHovered ? (
                      <span>Search</span>
                    ) : (
                      <Lottie options={defaultOptions} height={100} width={100} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
