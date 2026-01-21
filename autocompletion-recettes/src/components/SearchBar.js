import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [groupedSuggestions, setGroupedSuggestions] = useState({ startsWith: [], contains: [] });
  const [selectedIndex, setSelectedIndex] = useState(-1); // Index pour le clavier
  const [loading, setLoading] = useState(false); // Icône de chargement
  const navigate = useNavigate();
  const searchRef = useRef(null); // Pour détecter le clic extérieur

  // Liste plate pour la navigation au clavier
  const flatSuggestions = [...groupedSuggestions.startsWith, ...groupedSuggestions.contains];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) fetchSuggestions();
      else setGroupedSuggestions({ startsWith: [], contains: [] });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setGroupedSuggestions({ startsWith: [], contains: [] });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      if (data.meals) {
        const lower = query.toLowerCase();
        const sw = data.meals.filter(m => m.strMeal.toLowerCase().startsWith(lower)).slice(0, 5);
        const co = data.meals.filter(m => !m.strMeal.toLowerCase().startsWith(lower) && m.strMeal.toLowerCase().includes(lower)).slice(0, 5);
        setGroupedSuggestions({ startsWith: sw, contains: co });
      }
      setSelectedIndex(-1); // Réinitialise l'index à chaque nouvelle recherche
    } finally {
      setLoading(false);
    }
  };

  // Logique du clavier (basée sur votre image)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, flatSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(flatSuggestions[selectedIndex].strMeal);
      }
    } else if (e.key === 'Escape') {
      setGroupedSuggestions({ startsWith: [], contains: [] });
    }
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    setGroupedSuggestions({ startsWith: [], contains: [] });
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <div className="search-wrapper" ref={searchRef}>
      <form onSubmit={(e) => { e.preventDefault(); handleSuggestionClick(query); }} className="search-form">
        <div className="input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          {loading && <span className="loader-spinner">⏳</span>}
          
          {flatSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {/* On map sur les deux groupes en calculant l'index global */}
              {[...groupedSuggestions.startsWith, ...groupedSuggestions.contains].map((meal, index) => {
                const isDivider = index === groupedSuggestions.startsWith.length && groupedSuggestions.contains.length > 0;
                return (
                  <React.Fragment key={meal.idMeal}>
                    {isDivider && <li className="suggestion-divider">Autres résultats</li>}
                    <li 
                      onClick={() => handleSuggestionClick(meal.strMeal)}
                      className={`suggestion-item ${index === selectedIndex ? 'active' : ''} ${index < groupedSuggestions.startsWith.length ? 'starts-with' : ''}`}
                    >
                      <img src={meal.strMealThumb} alt="" className="suggestion-thumb" />
                      <span>{meal.strMeal}</span>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;