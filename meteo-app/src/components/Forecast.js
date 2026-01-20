import React from 'react';

function Forecast({ forecastData }) {
    if (!forecastData) return null;

    // L'API renvoie 40 prévisions (toutes les 3h). 
    // on n'en garde qu'1 par jour (celle de midi).
    const dailyData = forecastData.list.filter(reading => reading.dt_txt.includes("12:00:00"));

    return (
        <div className="forecast-container">
            <h3>Prévisions à 5 jours</h3>
            <div className="forecast-grid">
                {dailyData.map((day, index) => {
                    const date = new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
                    return (
                        <div key={index} className="forecast-card">
                            <p className="forecast-date">{date}</p>
                            <img 
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                                alt="icon" 
                            />
                            <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                            <p className="forecast-desc">{day.weather[0].description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Forecast;