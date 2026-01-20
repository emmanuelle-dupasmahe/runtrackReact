import { useState } from 'react';
import Meteo from './components/Weather';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
    // on initialise avec un objet Paris par défaut avec les coordonnées GPS
    const [city, setCity] = useState({ name: 'Paris', lat: 48.8566, lon: 2.3522 }); 

    const handleSearch = (cityData) => {
        setCity(cityData);
    };

    return (
        <div className="App">
            <h1 className="rainbow-text">Météo</h1>
            <SearchBar onSearch={handleSearch} />
            <Meteo ville={city} />
        </div>
    );
}

export default App;