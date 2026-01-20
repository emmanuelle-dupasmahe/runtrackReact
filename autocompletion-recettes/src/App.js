import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; 
import SearchResults from './components/SearchResults';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/recipe/:id" element={<div>Page Détail (Prochaine étape !)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

