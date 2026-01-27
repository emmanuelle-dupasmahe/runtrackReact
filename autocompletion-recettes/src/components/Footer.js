import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {year} <span className="logo-footer"><span className="blue">Glou</span><span className="orange">Ton</span> </span>Tous droits réservés.</p>
        <p>Données fournies par TheMealDB</p>
      </div>
    </footer>
  );
};

export default Footer;