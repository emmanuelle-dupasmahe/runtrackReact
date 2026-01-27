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
        <div style={{ minHeight: '50vh', background: '#ccc' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </div>
        
        {/* On écrit en brut pour voir si le problème vient du composant Footer */}
        <footer style={{ background: 'orange', padding: '20px', color: 'white', textAlign: 'center' }}>
          JE SUIS LE FOOTER DE TEST
        </footer>

        <Footer />
      </div>
    </Router>
  );
}

export default App;