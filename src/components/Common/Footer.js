// src/components/Common/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-text">Made with</span>
          <span className="heart">♥</span>
          <span className="footer-text">by</span>
          <a 
            href="https://github.com/C00LOO5"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            {'C00LOO5'}
          </a>
        </div>
        
        <div className="footer-right">
          <span className="footer-version">Alpha v1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;