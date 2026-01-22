import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onTyping = () => { } }) => {
  const [query, setQuery] = useState('');
  const [groupedSuggestions, setGroupedSuggestions] = useState({ startsWith: [], contains: [] });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const flatSuggestions = query.length === 0 
    ? history 
    : [...groupedSuggestions.startsWith, ...groupedSuggestions.contains];

  // debounce
  useEffect(() => {
    onTyping(query.length > 0);
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

 //lettres cherchées en gras
  const highlightMatch = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase()
            ? <strong key={i} className="match-highlight">{part}</strong>
            : part
        )}
      </span>
    );
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('glouton_history')) || [];
    setHistory(saved);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowHistory(false); setSelectedIndex(-1);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (name) => {
    const term = typeof name === 'string' ? name : name.strMeal;
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('glouton_history', JSON.stringify(newHistory));
    setQuery(term);
    setShowHistory(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
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
        handleSuggestionClick(flatSuggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
    setShowHistory(false);
    setSelectedIndex(-1);
  }
  };

  return (
    <div className="search-wrapper" ref={searchRef}>
      <form onSubmit={(e) => { e.preventDefault(); if(query.trim()) handleSuggestionClick(query); }} className="search-form">
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
          

          {showHistory && (history.length > 0 || flatSuggestions.length > 0) && (
            <ul className="suggestions-list">
              {query.length === 0 && (
                <>
                  <li className="suggestion-divider">Recherches récentes</li>
                  {history.map((item, i) => (
                    <li key={`hist-${i}`} className={`suggestion-item ${i === selectedIndex ? 'active' : ''}`} onClick={() => handleSuggestionClick(item)}>
                      <span className="history-icon">🕒</span> {item}
                    </li>
                  ))}
                  <li className="clear-history" onClick={(e) => { e.stopPropagation(); setHistory([]); localStorage.removeItem('glouton_history'); }}>Effacer l'historique</li>
                </>
              )}

              {query.length >= 2 && (
                <>
                  {groupedSuggestions.startsWith.map((meal, i) => (
                    <li key={meal.idMeal} className={`suggestion-item ${i === selectedIndex ? 'active' : ''}`} onClick={() => handleSuggestionClick(meal)}>
                      <img src={meal.strMealThumb} alt="" className="suggestion-thumb" />
                      <span>{highlightMatch(meal.strMeal, query)}</span>
                    </li>
                  ))}
                  {groupedSuggestions.contains.length > 0 && (
                    <>
                      <li className="suggestion-divider">Autres résultats</li>
                      {groupedSuggestions.contains.map((meal, i) => {
                        const globalIndex = i + groupedSuggestions.startsWith.length;
                        return (
                          <li key={meal.idMeal} className={`suggestion-item ${globalIndex === selectedIndex ? 'active' : ''}`} onClick={() => handleSuggestionClick(meal)}>
                            <img src={meal.strMealThumb} alt="" className="suggestion-thumb" />
                            <span>{highlightMatch(meal.strMeal, query)}</span>
                          </li>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </ul>
          )}
        </div>
        <button type="submit" className="search-button">Rechercher</button>
      </form>
    </div>
  );
};

export default SearchBar;