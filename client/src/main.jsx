import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Add event listener after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  // Ripple effect for buttons
  const addRippleEffect = (element) => {
    element.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      
      element.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  };
  
  // Add ripple effect to all buttons
  document.querySelectorAll('button, .profile-button, .home-button, .game-button, .leaderboard-button, .form-button').forEach(addRippleEffect);
  
  // Navbar scroll effect
  const handleScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // Add animation classes when elements come into view
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.profile-card, .game-card, .leaderboard-card, .form-card, .home-card, .feature-card').forEach(el => {
    observer.observe(el);
  });
});
