import React from 'react';


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {year}<span className="footer-rainbow"> Météo</span> Tous droits réservés.</p>
        <p>Données fournies par OpenWeather</p>
      </div>
    </footer>
  );
};

export default Footer;