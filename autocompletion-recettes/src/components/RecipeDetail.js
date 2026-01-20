import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetail();
  }, [id]);

  if (loading) return <div className="loader">Mise en plat en cours...</div>;

  // 7. Gérer le cas où la recette n'existe pas
  if (!recipe) return <div className="error">Recette introuvable !</div>;

  // Astuce : Combiner ingrédients et mesures
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
      {/* 6. Bouton Retour */}
      <button onClick={() => navigate(-1)} className="back-button">
        Retour aux résultats
      </button>

      <div className="recipe-card-detail">
        <div className="recipe-header">
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
  );
};

export default RecipeDetail;