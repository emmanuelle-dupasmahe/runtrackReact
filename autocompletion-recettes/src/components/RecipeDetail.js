import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import logoImg from './glouton.png';
import './RecipeDetail.css';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeDetail = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                const data = await response.json();
                setRecipe(data.meals ? data.meals[0] : null);
            } catch (error) {
                console.error("Erreur :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipeDetail();
    }, [id]);

    if (loading) return <div className="loader">Chargement...</div>;
    if (!recipe) return <div className="error">Recette introuvable !</div>;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push({ name: ingredient, amount: measure });
        }
    }

    return (
        <div className="recipe-detail-page">
            <header className="detail-header">
                <Link to="/" className="mini-logo">
                    <img src={logoImg} alt="Logo" className="header-logo-img" />
                    <span className="blue">Glou</span><span className="orange">Ton</span>
                </Link>
                <div className="header-search-bar">
                    <SearchBar />
                </div>
            </header>

            <div className="content-wrapper">
                <button onClick={() => navigate(-1)} className="back-button">
                    ← Retour aux résultats
                </button>

                <div className="recipe-card-detail">
                    <div className="recipe-header-main">
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="detail-img" />
                        <div className="header-info">
                            <h1>{recipe.strMeal}</h1>
                            <p className="category">Catégorie : <span>{recipe.strCategory}</span></p>
                            <p className="area">Origine : <span>{recipe.strArea}</span></p>
                        </div>
                    </div>

                    <section className="ingredients-section">
                        <h2>Ingrédients</h2>
                        <div className="ingredients-grid">
                            {ingredients.map((item, index) => (
                                <div key={index} className="ingredient-item">
                                    <strong>{item.amount}</strong> {item.name}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="instructions-section">
                        <h2>Instructions</h2>
                        <p className="instructions-text">{recipe.strInstructions}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;