import { useState, useEffect } from 'react';
import Meteo from './components/Weather';
import SearchBar from './components/SearchBar';
import Favorites from './components/Favorites';
import './App.css';


// on initialise avec un objet Paris par défaut avec les coordonnées GPS
function App() {
    const [city, setCity] = useState({ name: 'Paris', lat: 48.8566, lon: 2.3522 });
    const [favorites, setFavorites] = useState([]);

    
    useEffect(() => {
        const savedFavorites = localStorage.getItem('meteo-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    
    const addToFavorites = (cityData) => {
        // on vérifie si la ville est déjà présente
        const exists = favorites.find(f => f.name === cityData.name);
        if (!exists) {
            const newFavorites = [...favorites, cityData];
            setFavorites(newFavorites);
            localStorage.setItem('meteo-favorites', JSON.stringify(newFavorites));
        }
    };

    
    const removeFromFavorites = (cityName) => {
        const newFavorites = favorites.filter(f => f.name !== cityName);
        setFavorites(newFavorites);
        localStorage.setItem('meteo-favorites', JSON.stringify(newFavorites));
    };

    return (
        <div className="App">
            <h1 className="rainbow-text">Météo</h1>
            <SearchBar onSearch={setCity} />
            
            <Favorites 
                favorites={favorites} 
                onSelectFavorite={setCity} 
                onRemoveFavorite={removeFromFavorites} 
            />

            <Meteo ville={city} onAddFavorite={addToFavorites} />
        </div>
    );
}

export default App;