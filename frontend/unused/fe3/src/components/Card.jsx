import React from 'react';
import styled from 'styled-components';
import Button from '../external/Button';

const Card = ({ appName, className, onClick }) => {
  return (
    <StyledWrapper>
      <div className={`card ${className}`}>
        <p className='appName'>{appName}</p>
        <div className="button-container">
          <Button onClick={onClick} />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 20vw;
    height: 50vh;
    background: mediumturquoise;
    display: flex;
    flex-direction: column; 
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    z-index: 1100; 
    overflow: hidden;
  }
  .appName{
    font-style:italic;
    position:absolute;
    max-width:12vw;
    top:20px;
    font-size:0.8em;
    text-decoration:underline;
  }
  .card::before,
  .card::after {
    position: absolute;
    content: "";
    width: 20%;
    height: 20%;
    background-color: lightblue;
    transition: all 0.5s;
    z-index: 1; 
  }

  .card::before {
    top: 0;
    right: 0;
    border-radius: 0 15px 0 100%;
  }

  .card::after {
    bottom: 0;
    left: 0;
    border-radius: 0 100% 0 15px;
  }

  .card:hover::before,
  .card:hover::after {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  .card:hover::after {
    content: "HELLO";
  }

  .button-container {
    position:absolute;
    z-index: 2; 
    top:41vh;
  }

  h2 {
    z-index: 2; 
  }
`;

export default Card;
