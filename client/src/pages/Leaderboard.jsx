import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard, getUserScores } from '../features/game/scoreSlice';

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPersonal, setShowPersonal] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { leaderboard, userScores, pagination, loading } = useSelector((state) => state.score);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    dispatch(getLeaderboard({ page: currentPage, limit: 10 }));
    dispatch(getUserScores());
  }, [dispatch, isAuthenticated, navigate, currentPage]);
  
  const handleNextPage = () => {
    if (currentPage < pagination.pages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const toggleView = () => {
    setShowPersonal(!showPersonal);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <div className="leaderboard-card">
          <div className="leaderboard-header">
            <h1 className="leaderboard-title">
              {showPersonal ? 'Your Scores' : 'Global Leaderboard'}
            </h1>
            
            <button
              onClick={toggleView}
              className="toggle-view-button"
            >
              {showPersonal ? 'View Global' : 'View Your Scores'}
            </button>
          </div>
          
          <div className="leaderboard-table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  {showPersonal && <th>Date</th>}
                </tr>
              </thead>
              <tbody>
                {showPersonal
                  ? userScores.map((score, index) => (
                      <tr key={score._id}>
                        <td>{index + 1}</td>
                        <td>{score.username}</td>
                        <td className="bold">{score.score}</td>
                        <td>{formatDate(score.createdAt)}</td>
                      </tr>
                    ))
                  : leaderboard.map((score, index) => {
                      const rank = (currentPage - 1) * 10 + index + 1;
                      return (
                        <tr
                          key={score._id}
                          className={rank <= 3 ? 'top-rank' : ''}
                        >
                          <td>
                            {rank <= 3 ? (
                              <span className="rank-label">
                                <span className={`rank-badge rank-${rank}`}>
                                  {rank}
                                </span>
                                {rank === 1 ? '🏆' : rank === 2 ? '🥈' : '🥉'}
                              </span>
                            ) : (
                              rank
                            )}
                          </td>
                          <td>{score.username}</td>
                          <td className="bold">{score.score}</td>
                        </tr>
                      );
                    })}
                
                {((showPersonal && userScores.length === 0) || (!showPersonal && leaderboard.length === 0)) && (
                  <tr>
                    <td colSpan={showPersonal ? 4 : 3} className="empty-message">
                      {showPersonal ? 'You have no scores yet. Play the game!' : 'No scores found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {!showPersonal && pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`page-button ${currentPage === 1 ? 'disabled' : 'active'}`}
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {pagination.pages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === pagination.pages}
                className={`page-button ${currentPage === pagination.pages ? 'disabled' : 'active'}`}
              >
                Next
              </button>
            </div>
          )}
          
          <button
            onClick={() => navigate('/game')}
            className="leaderboard-play-button"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 