import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { resetGameState } from '../features/game/scoreSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    dispatch(resetGameState());
    dispatch(logout());
    navigate('/');
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Counter Game
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/game" className="navbar-link">Play</Link>
              <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
            </>
          )}
        </div>

        {/* Desktop Auth Actions */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="navbar-welcome">Hello, {user?.username}!</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button">Login</Link>
              <Link to="/register" className="signup-button">Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button 
          ref={hamburgerRef}
          className="navbar-menu-button" 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              // X icon when menu is open
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              // Hamburger icon when menu is closed
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}
        >
          {isAuthenticated ? (
            <>
              <span className="navbar-welcome">Hello, {user?.username}!</span>
              <Link to="/" className="navbar-mobile-link" onClick={handleNavLinkClick}>Home</Link>
              <Link to="/game" className="navbar-mobile-link" onClick={handleNavLinkClick}>Play</Link>
              <Link to="/leaderboard" className="navbar-mobile-link" onClick={handleNavLinkClick}>Leaderboard</Link>
              <Link to="/profile" className="navbar-mobile-link" onClick={handleNavLinkClick}>Profile</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className="navbar-mobile-link" onClick={handleNavLinkClick}>Home</Link>
              <Link to="/login" className="navbar-mobile-link" onClick={handleNavLinkClick}>Login</Link>
              <Link to="/register" className="navbar-mobile-link" onClick={handleNavLinkClick}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 