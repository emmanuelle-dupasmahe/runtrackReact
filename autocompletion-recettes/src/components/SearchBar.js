import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) { // Ne cherche qu'à partir de 2 caractères
        fetchSuggestions();
      } else {
        setSuggestions([]); // 
      }
    }, 300); // Attendre 300ms après la dernière frappe

    return () => clearTimeout(timer); // Nettoyage du timer
  }, [query]);


  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();

      setSuggestions(data.meals ? data.meals.slice(0, 10) : []);
    } catch (error) {
      console.error("Erreur suggestions:", error);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setSuggestions([]); // Cache les suggestions lors de la navigation
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };


  const handleSuggestionClick = (mealName) => {
    setQuery(mealName); // Remplir l'input
    setSuggestions([]); // Cacher la liste
    navigate(`/search?q=${encodeURIComponent(mealName)}`); // Lancer la recherche
  };

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSearch} className="search-form">
        <div className="input-container">
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />



          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((meal) => (
                <li
                  key={meal.idMeal}
                  onClick={() => handleSuggestionClick(meal.strMeal)}
                  className="suggestion-item"
                >
                  
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="suggestion-thumb"
                  />
                  <span>{meal.strMeal}</span>
                </li>
              ))}
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
