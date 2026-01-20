import React from 'react';
import SearchBar from './SearchBar';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h1 className="logo">
          <span className="blue">Miam</span>
          <span className="orange">Miam</span>
        </h1>
        <p className="subtitle">Trouvez votre prochaine recette parmi des milliers de plats</p>
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;