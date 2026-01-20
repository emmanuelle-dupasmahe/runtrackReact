import { useState, useEffect } from 'react';
import Meteo from './components/Weather';
import SearchBar from './components/SearchBar';
import Favorites from './components/Favorites';
import './App.css';


// on initialise avec un objet Paris par défaut avec les coordonnées GPS
function App() {
    const [city, setCity] = useState({ name: 'Paris', lat: 48.8566, lon: 2.3522 });
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);


    useEffect(() => {
        const savedFavorites = localStorage.getItem('meteo-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    useEffect(() => {
        const savedHistory = localStorage.getItem('meteo-history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
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

    const addToHistory = (cityData) => {
        setHistory(prevHistory => {
            // Supprimer la ville si elle existe déjà pour la remettre en haut
            const filtered = prevHistory.filter(item => item.name !== cityData.name);
            const newHistory = [cityData, ...filtered].slice(0, 5); // Garder seulement les 5 derniers
            localStorage.setItem('meteo-history', JSON.stringify(newHistory));
            return newHistory;
        });
    };
    const handleSearch = (cityData) => {
        setCity(cityData);
        addToHistory(cityData);
    };
   return (
    <div className="App">
        <h1 className="rainbow-text">Météo</h1>
        
        {/* On utilise handleSearch au lieu de setCity directement */}
        <SearchBar onSearch={handleSearch} />

        {/* Affichage de l'historique */}
        {history.length > 0 && (
            <div className="history-container">
                <small>Recherches récentes :</small>
                <div className="history-list">
                    {history.map((item, index) => (
                        <button 
                            key={index} 
                            onClick={() => setCity(item)} 
                            className="history-item"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        )}

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