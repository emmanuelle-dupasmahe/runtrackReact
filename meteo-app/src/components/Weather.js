import { useState, useEffect } from 'react';

function Meteo({ville}) {
    const [meteo, setMeteo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    useEffect(() => {
        if (!ville) return; 

        const fetchMeteo = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('Ville non trouvée. Vérifiez l\'orthographe.');
                }
                
                const data = await response.json();
                setMeteo(data);
            } catch (error) {
                setError(error.message);
                setMeteo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMeteo();
    }, [ville, API_KEY]); 

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!meteo) return <p>Recherchez une ville pour voir la météo.</p>;

    return (
        
    <div className="weather-card" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
        <h2>{meteo.name}, {meteo.sys.country}</h2>
        <img 
            src={`https://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png`} 
            alt={meteo.weather[0].description} 
        />
        
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {Math.round(meteo.main.temp)}°C
        </p>
            {/* <h2>{meteo.name}, {meteo.sys.country}</h2> */}
            {/* <p><strong>Température :</strong> {Math.round(meteo.main.temp)}°C</p> */}
            <p><strong>Ressenti : </strong> {Math.round(meteo.main.feels_like)}°C</p>
            <p><strong>Description :</strong> {meteo.weather[0].description}</p>
            <p><strong>Humidité :</strong> {meteo.main.humidity}%</p>
        </div>
    );
}

export default Meteo;