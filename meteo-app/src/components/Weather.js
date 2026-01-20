import { useState, useEffect } from 'react';

function Meteo({ ville }) {
    const [meteo, setMeteo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    useEffect(() => {
        if (!ville) return;

        const fetchMeteo = async () => {
            setLoading(true);
            setError(null);
            try {
                let url;
                // Si on a des coordonnées GPS (plus fiable)
                if (ville.lat && ville.lon) {
                    url = `https://api.openweathermap.org/data/2.5/weather?lat=${ville.lat}&lon=${ville.lon}&appid=${API_KEY}&units=metric&lang=fr`;
                } else {
                    url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error('Ville non trouvée');
                
                const data = await response.json();
                setMeteo(data);
            } catch (err) {
                setError(err.message);
                setMeteo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMeteo();
    }, [ville, API_KEY]);

    if (loading) return <p className="loading">Chargement...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!meteo) return null;

    return (
        <div className="weather-card">
            <h2>{meteo.name}</h2>
            <img 
                src={`https://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png`} 
                alt="icon" 
            />
            <p className="temp">{Math.round(meteo.main.temp)}°C</p>
            <p className="desc">{meteo.weather[0].description}</p>
            <div className="details">
                <p>💧 Humidité : {meteo.main.humidity}%</p>
                <p>💨 Vent : {meteo.wind.speed} km/h</p>
            </div>
        </div>
    );
}

export default Meteo;