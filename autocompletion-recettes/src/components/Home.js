import React, { useState } from 'react';
import SearchBar from './SearchBar';
import './Home.css';
import logoImg from './glouton.png';
import logoOpenImg from './glouton-open.png';



const Home = () => {
  const [isHungry, setIsHungry] = React.useState(false);

  return (
    <div className="home-container">
      <div className="hero">
        <h1
          className="logo"
          onMouseOver={() => setIsHungry(true)}  
          onMouseOut={() => setIsHungry(false)}
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1000 
          }}
        >
          <img
            src={isHungry ? logoOpenImg : logoImg}
            alt="GlouTon Logo"
            className="logo-icon"
            style={{ pointerEvents: 'none' }} 
          />
          <span className="blue">Glou</span>
          <span className="orange">Ton</span>
        </h1>

        <SearchBar onTyping={(status) => setIsHungry(status)} />
      </div>
    </div>
  );
};


export default Home;