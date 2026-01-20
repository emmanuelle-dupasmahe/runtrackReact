import React from 'react';
import SearchBar from './SearchBar';
import './Home.css';
import logoImg from './glouton.png';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h1 className="logo">
        <img src={logoImg} alt="GlouTon Logo" className="logo-icon" />
          <span className="blue">Glou</span>
          <span className="orange">Ton</span>
        </h1>
        <p className="subtitle">Trouvez votre prochaine recette parmi des milliers de plats</p>
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;