import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (input.length > 2) {
            fetch(`https://api-adresse.data.gouv.fr/search/?q=${input}&type=municipality&limit=5`)
                .then(res => res.json())
                .then(data => setSuggestions(data.features))
                .catch(err => console.error("Erreur API Adresse", err));
        } else {
            setSuggestions([]);
        }
    }, [input]);

    const selectCity = (s) => {
        const cityData = {
            name: s.properties.city,
            lat: s.geometry.coordinates[1], // Latitude
            lon: s.geometry.coordinates[0]  // Longitude
        };
        onSearch(cityData);
        setInput(s.properties.city);
        setSuggestions([]);
    };

    return (
    
    <div className="search-container" style={{ position: 'relative' }}>
        <form onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                placeholder="Chercher une ville..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                /* ✅ Sécurité : on vérifie si suggestions existe avant .length */
                style={{ borderRadius: (suggestions && suggestions.length > 0) ? '20px 0 0 0' : '20px 0 0 20px' }}
            />
        </form>

        {/* ✅ Sécurité : on vérifie que suggestions est bien un tableau et n'est pas vide */}
        {Array.isArray(suggestions) && suggestions.length > 0 && (
            <ul className="suggestions-list">
                {suggestions.map((s, index) => (
                    <li key={index} onClick={() => selectCity(s)}>
                        {s.properties.city} ({s.properties.postcode.substring(0, 2)})
                    </li>
                ))}
            </ul>
        )}
    </div>

    );
}

export default SearchBar;