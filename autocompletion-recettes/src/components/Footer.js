import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {year} <span className="logo-footer">GlouTon</span>. Tous droits réservés.</p>
        <p>Données fournies par TheMealDB</p>
      </div>
    </footer>
  );
};

export default Footer;