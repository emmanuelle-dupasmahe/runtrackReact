import { useState, useEffect } from 'react';
import Forecast from './Forecast';

const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

function Meteo({ ville, onAddFavorite }) {
    const [meteo, setMeteo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        if (!ville) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const baseUrl = "https://api.openweathermap.org/data/2.5/";
                const params = (ville.lat && ville.lon)
                    ? `lat=${ville.lat}&lon=${ville.lon}`
                    : `q=${ville}`;

                const commonOptions = `&appid=${API_KEY}&units=metric&lang=fr`;

                // Appel météo actuelle
                const resWeather = await fetch(`${baseUrl}weather?${params}${commonOptions}`);
                const dataWeather = await resWeather.json();
                setMeteo(dataWeather);

                // Appel prévisions (forecast)
                const resForecast = await fetch(`${baseUrl}forecast?${params}${commonOptions}`);
                const dataForecast = await resForecast.json();
                setForecast(dataForecast);

            } catch (err) {
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ville, API_KEY]);



    if (loading) return <p className="loading">Chargement...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!meteo) return null;



    return (
        <div className="weather-card">
            <button
                className="btn-fav"
                onClick={() => onAddFavorite({ name: meteo.name, lat: meteo.coord.lat, lon: meteo.coord.lon })}
            >
                ⭐ Ajouter aux favoris
            </button>
            <h2>{meteo.name}</h2>
            <img
                src={`https://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png`}
                alt="icon"
            />
            <p className="temp">{Math.round(meteo.main.temp)}°C</p>
            <p className="feels-like">
                Ressenti : {Math.round(meteo.main.feels_like)}°C
            </p>
            <div className="min-max-container">

                <span className={meteo.main.temp_min < 10 ? 'temp-cold' : 'temp-normal'}>
                    Min : {Math.round(meteo.main.temp_min)}°C
                </span>

                <span className="separator">|</span>

                <span className={meteo.main.temp_max > 25 ? 'temp-hot' : 'temp-normal'}>
                    Max : {Math.round(meteo.main.temp_max)}°C
                </span>
            </div>
            <p className="desc">{meteo.weather[0].description}</p>
            <div className="details">
                <p>💧 Humidité : {meteo.main.humidity}%</p>
                <p>💨 Vent : {meteo.wind.speed} km/h</p>
            </div>
            <div className="sun-times">
                <p>🌅 Lever : {formatTime(meteo.sys.sunrise)}</p>
                <p>🌇 Coucher : {formatTime(meteo.sys.sunset)}</p>
            </div>
            <Forecast forecastData={forecast} />
        </div>

    );
}
export default Meteo;