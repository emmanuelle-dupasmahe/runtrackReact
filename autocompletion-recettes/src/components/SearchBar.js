import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onTyping }) => {
  const [query, setQuery] = useState('');
  const [groupedSuggestions, setGroupedSuggestions] = useState({ startsWith: [], contains: [] });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
 
  useEffect(() => {
    if (query.length > 0) {
      onTyping(true); // GlouTon a faim !
    } else {
      onTyping(false); // Il ferme la bouche
    }

    const timer = setTimeout(() => {
      if (query.length >= 2) fetchSuggestions();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onTyping]);
  



  const flatSuggestions = [...groupedSuggestions.startsWith, ...groupedSuggestions.contains];

  // charge l'historique
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('glouton_history')) || [];
    setHistory(savedHistory);
  }, []);

  // détection du clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowHistory(false);
        setGroupedSuggestions({ startsWith: [], contains: [] });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // API Suggestions avec Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) fetchSuggestions();
      else setGroupedSuggestions({ startsWith: [], contains: [] });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

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
      setSelectedIndex(-1);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    const newHistory = [searchTerm, ...history.filter(h => h !== searchTerm)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('glouton_history', JSON.stringify(newHistory));
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    saveToHistory(name);
    setShowHistory(false);
    setGroupedSuggestions({ startsWith: [], contains: [] });
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSuggestionClick(query);
    }
  };

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
      setShowHistory(false);
      setGroupedSuggestions({ startsWith: [], contains: [] });
    }
  };

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase()
            ? <strong key={i} style={{ color: '#ea9335', fontWeight: 'bold' }}>{part}</strong>
            : part
        )}
      </span>
    );
  };



  return (
    <div className="search-wrapper" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          {loading && <span className="loader-spinner">⏳</span>}

          {/* affichage de l'historique (quand vide) */}
          {showHistory && query.length === 0 && history.length > 0 && (
            <ul className="suggestions-list history-list">
              <li className="suggestion-divider">Recherches récentes</li>
              {history.map((item, index) => (
                <li key={index} className="suggestion-item history-item" onClick={() => handleSuggestionClick(item)}>
                  <span className="history-icon">🕒</span>
                  <span>{item}</span>
                </li>
              ))}
              <li className="clear-history" onClick={() => { setHistory([]); localStorage.removeItem('glouton_history'); }}>
                Effacer l'historique
              </li>
            </ul>
          )}

          {/* affichage des suggestions API (quand query >= 2) */}
          {flatSuggestions.length > 0 && (
            <ul className="suggestions-list">
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
                      <span>{highlightMatch(meal.strMeal, query)}</span>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
        
        <div className="button-container">
            <button type="submit" className="search-button">Rechercher</button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;