import React from 'react';
import './OpenCloseButton.css';

const OpenCloseButton = ({ toggleSideMenu, sideMenuOpen }) => {
  return (
    <button 
      id="btn" 
      onClick={toggleSideMenu} 
      className={`relative w-20 h-20 rounded-full bg-white border-none outline-none cursor-pointer flex items-center justify-center transition-all duration-300 ${sideMenuOpen ? 'on' : ''}`}
    >
      {[1, 2, 3].map((_, index) => (
        <span 
          key={index} 
          className={`line ${index === 0 ? 'line1' : index === 1 ? 'line2' : 'line3'} ${sideMenuOpen ? 'on' : 'off'}`}
        ></span>
      ))}
      <span id='men'>
        {sideMenuOpen ? 'Close' : 'Menu'}
      </span>
    </button>
  );
};

export default OpenCloseButton;
