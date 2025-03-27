import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserStats } from '../features/game/scoreSlice';
import { updateUsername } from '../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError } = useSelector(state => state.auth);
  const { userStats, loading: statsLoading } = useSelector(state => state.score);
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  useEffect(() => {
    dispatch(getUserStats());
  }, [dispatch]);
  
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);
  
  const navigateToGame = () => {
    navigate('/game');
  };
  
  const navigateToLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUsername(user?.username || '');
    setUpdateSuccess(false);
  };
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleUpdateUsername = async () => {
    if (username && username !== user?.username) {
      const resultAction = await dispatch(updateUsername(username));
      if (updateUsername.fulfilled.match(resultAction)) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    }
    setIsEditing(false);
  };
  
  const loading = authLoading || statsLoading;
  
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card">
          <h1 className="profile-title">Your Profile</h1>
          
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            
            <div className="profile-details">
              {isEditing ? (
                <div className="profile-edit-form">
                  <input 
                    type="text" 
                    value={username}
                    onChange={handleUsernameChange}
                    className="profile-input"
                    placeholder="Enter new username"
                  />
                  <div className="profile-edit-actions">
                    <button 
                      onClick={handleUpdateUsername}
                      className="profile-save-button"
                      disabled={!username || username === user?.username}
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleEditToggle}
                      className="profile-cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="profile-username-container">
                    <div className="profile-username">{user?.username}</div>
                    <button 
                      onClick={handleEditToggle} 
                      className="profile-edit-button"
                      aria-label="Edit username"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="profile-email">{user?.email}</div>
                </>
              )}
              {updateSuccess && (
                <div className="profile-update-success">
                  Username updated successfully!
                </div>
              )}
              {authError && (
                <div className="profile-update-error">
                  {authError}
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-stats-container">
            <h2 className="profile-section-title">Game Statistics</h2>
            <div className="profile-stats">
              <div className="stat-box">
                <div className="stat-label">High Score</div>
                <div className="stat-value">{userStats.highScore}</div>
              </div>
              
              <div className="stat-box">
                <div className="stat-label">Games Played</div>
                <div className="stat-value">{userStats.gamesPlayed}</div>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="stat-box">
                <div className="stat-label">Average Score</div>
                <div className="stat-value">{userStats.averageScore}</div>
              </div>
              
              <div className="stat-box">
                <div className="stat-label">Total Points</div>
                <div className="stat-value">{userStats.totalScore}</div>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button 
              onClick={navigateToGame}
              className="profile-button play-button"
            >
              Play Game
            </button>
            
            <button 
              onClick={navigateToLeaderboard}
              className="profile-button view-scores-button"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 