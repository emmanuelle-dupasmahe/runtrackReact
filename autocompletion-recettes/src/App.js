import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; 
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import RecipeDetail from './components/RecipeDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

