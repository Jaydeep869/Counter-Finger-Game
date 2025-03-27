import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          Welcome to the Counter Game
        </h1>
        
        <p className="home-description">
          A simple yet addictive game where you compete with others for the highest score by clicking a button as many times as possible.
        </p>
        
        {isAuthenticated ? (
          <div>
            <div className="home-card">
              <h2 className="home-welcome">
                Hello, {user?.username}!
              </h2>
              <p className="home-score">
                Your current high score: <span className="bold">{user?.highScore || 0}</span>
              </p>
              <div className="home-buttons">
                <Link
                  to="/game"
                  className="home-button play-button"
                >
                  Play Now
                </Link>
                <Link
                  to="/leaderboard"
                  className="home-button leaderboard-button"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="signup-btn"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
      
      {}
      <div className="features-container">
        <h2 className="features-title">Game Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">Simple Gameplay</h3>
            <p className="feature-description">
              Just click as fast as you can to increase your score. How high can you go?
            </p>
          </div>
          
          <div className="feature-card">
            <h3 className="feature-title">Competitive Leaderboard</h3>
            <p className="feature-description">
              Compete with players around the world to see who can achieve the highest score.
            </p>
          </div>
          
          <div className="feature-card">
            <h3 className="feature-title">Track Your Progress</h3>
            <p className="feature-description">
              See your personal history and track your improvement over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 