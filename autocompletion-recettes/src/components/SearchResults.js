import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import './SearchResults.css';
import logoImg from './glouton.png';
import logoOpenImg from './glouton-open.png';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchMeals = async () => {
            setLoading(true);
            try {
                const catRes = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
                const catData = await catRes.json();
                const isCategory = catData.meals.some(c => c.strCategory.toLowerCase() === query.toLowerCase());

                const url = isCategory
                    ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`
                    : `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

                const response = await fetch(url);
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

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // récupère la liste des catégories au chargement
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
            .then(res => res.json())
            .then(data => setCategories(data.meals));
    }, []);

    return (
        <div className="search-container">
            <header className="results-header">

                <Link to="/" className="mini-logo">
                    <img
                        src={loading ? logoOpenImg : logoImg}
                        alt="Logo GlouTon"
                        className={`header-logo-img ${loading ? 'excited' : ''}`}
                    />
                    <div className="logo-text-wrapper">
                        <span className="blue">Glou</span><span className="orange">Ton</span>
                    </div>
                </Link>


                <div className="search-bar-container">
                    <SearchBar />
                </div>
            </header>

            <div className="filter-bar">
                {categories && categories.map(cat => ( 
                    <button
                        key={cat.strCategory}
                        onClick={() => navigate(`/search?q=${cat.strCategory}`)}
                        className="filter-chip"
                    >
                        {cat.strCategory}
                    </button>
                ))}
            </div>
            {
                loading ? (
                    <div className="loader">Chargement des recettes...</div>
                ) : (
                    <div className="results-grid">

                        {meals.length > 0 ? (
                            meals.map((meal) => (

                                <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="recipe-card">
                                    <div className="card-image">
                                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                                    </div>
                                    <div className="card-content">
                                        <h3>{meal.strMeal}</h3>

                                        {meal.strCategory && <span className="category-tag">{meal.strCategory}</span>}
                                        {meal.strArea && <p className="area-text">{meal.strArea}</p>}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="no-result">
                                Désolé, nous n'avons trouvé aucune recette pour "{query}".
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    );
};

export default SearchResults;