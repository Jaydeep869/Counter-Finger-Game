import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">© {new Date().getFullYear()} Counter Game. All rights reserved.</p>
        <p className="footer-credit">Created with <span className="footer-heart">❤️</span> by Jaydeep Pokhariya</p>
      </div>
    </footer>
  );
};

export default Footer; 