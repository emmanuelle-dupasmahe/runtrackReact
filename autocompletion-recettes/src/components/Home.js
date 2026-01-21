import React from 'react';
import SearchBar from './SearchBar';
import './Home.css';
import logoImg from './glouton.png';
import logoOpenImg from './glouton-open.png';



const Home = () => {
  const [isHungry, setIsHungry] = React.useState(false);

  return (
    <div className="home-container">
      <div className="hero">
        <h1 className="logo">
          <img 
            src={isHungry ? logoOpenImg : logoImg} 
            alt="GlouTon Logo" 
            className={`logo-icon ${isHungry ? 'excited' : ''}`} 
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