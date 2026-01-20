import { useState } from 'react';
import './App.css';
import Meteo from './components/Weather';
import SearchBar from './components/SearchBar';

function App() {
    const [city, setCity] = useState('Paris'); 

    const handleSearch = (searchCity) => {
        setCity(searchCity);
    };

    return (
        <div className='App'>
            <h1 className="rainbow-text">Météo</h1>
            <SearchBar onSearch={handleSearch} />
            <Meteo ville={city} />
        </div>
        
    );
}

export default App;
