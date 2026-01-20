import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        setMeals(data.meals || []);
      } catch (error) {
        console.error("Erreur API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchMeals();
  }, [query]);

  return (
    <div className="search-container">
      <header className="results-header">
        <Link to="/" className="logo-text">Glou<span>Ton</span></Link>
        <p>Résultats pour : <strong>{query}</strong></p>
      </header>

      {/* 8. Afficher un loader pendant le chargement */}
      {loading ? (
        <div className="loader">Chargement des recettes...</div>
      ) : (
        <div className="results-grid">
          {/* 7. Gérer le cas où aucun résultat n'est trouvé */}
          {meals.length > 0 ? (
            meals.map((meal) => (
              /* 6. Chaque card doit rediriger vers /recipe/:id */
              <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="recipe-card">
                <div className="card-image">
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                </div>
                <div className="card-content">
                  <h3>{meal.strMeal}</h3>
                  <span className="category-tag">{meal.strCategory}</span>
                  <p className="area-text">{meal.strArea}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-result">
              Désolé, nous n'avons trouvé aucune recette pour "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;