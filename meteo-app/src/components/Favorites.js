import React from 'react';

function Favorites({ favorites, onSelectFavorite, onRemoveFavorite }) {
    if (favorites.length === 0) return null;

    return (
        <div className="favorites-container">
            <h3>Mes Favoris</h3>
            <div className="favorites-list">
                {favorites.map((city, index) => (
                    <div key={index} className="favorite-item">
                        <span onClick={() => onSelectFavorite(city)}>
                            {city.name}
                        </span>
                        <button 
                            className="btn-remove" 
                            onClick={() => onRemoveFavorite(city.name)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;