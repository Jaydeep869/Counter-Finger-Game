import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { incrementScore, resetScore, saveScore } from '../features/game/scoreSlice';

const Game = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentScore, loading } = useSelector((state) => state.score);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    let timer;
    
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);
  
  const startGame = () => {
    dispatch(resetScore());
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
  };
  
  const handleClick = () => {
    if (isPlaying) {
      dispatch(incrementScore());
    }
  };
  
  const saveGameScore = () => {
    dispatch(saveScore(currentScore));
    setGameOver(false);
  };
  
  const viewLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  return (
    <div className="game-container">
      <div className="game-card">
        <h1 className="game-title">Counter Game</h1>
        
        {/* Game Info */}
        <div className="game-stats">
          <div className="stat-card time-card">
            <p className="time-label">Time Left</p>
            <p className="time-value">{timeLeft}s</p>
          </div>
          
          <div className="stat-card score-card">
            <p className="score-label">Score</p>
            <p className="score-value">{currentScore}</p>
          </div>
        </div>
        
        {}
        <button
          onClick={handleClick}
          disabled={!isPlaying}
          className={`game-button ${isPlaying ? 'active' : 'inactive'}`}
        >
          {isPlaying ? 'CLICK!' : 'Wait...'}
        </button>
        
        {}
        <div>
          {!isPlaying && !gameOver && (
            <button
              onClick={startGame}
              className="start-button"
            >
              Start Game
            </button>
          )}
          
          {gameOver && (
            <div className="game-over">
              <h2 className="game-over-title">Game Over!</h2>
              <p className="game-over-score">Your score: <span className="bold">{currentScore}</span></p>
              
              <div className="game-over-buttons">
                <button
                  onClick={saveGameScore}
                  disabled={loading}
                  className="save-button"
                >
                  {loading ? 'Saving...' : 'Save Score'}
                </button>
                
                <button
                  onClick={startGame}
                  className="play-again-button"
                >
                  Play Again
                </button>
                
                <button
                  onClick={viewLeaderboard}
                  className="leaderboard-link-button"
                >
                  Leaderboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {}
      {!isPlaying && !gameOver && (
        <div className="game-instructions">
          <h2 className="instructions-title">How to Play</h2>
          <p className="instructions-text">
            Click the button as many times as you can within 30 seconds.
          </p>
          <p className="instructions-text">
            Compete for the highest score and climb the leaderboard!
          </p>
        </div>
      )}
    </div>
  );
};

export default Game; 