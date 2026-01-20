
import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Appel à l'API Adresse quand l'utilisateur tape
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input);
            setSuggestions([]);
        }
    };

    return (
        <div className="search-container" style={{ position: 'relative' }}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Chercher une ville française..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ borderRadius: suggestions.length > 0 ? '20px 0 0 0' : '20px 0 0 20px' }}
                />
                <button type="submit">Rechercher</button>
            </form>

            {/* Liste des suggestions */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((s, index) => (
                        <li key={index} onClick={() => {
                            setInput(s.properties.city);
                            onSearch(s.properties.city);
                            setSuggestions([]);
                        }}>
                            {s.properties.city} ({s.properties.context.split(',')[0]})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;