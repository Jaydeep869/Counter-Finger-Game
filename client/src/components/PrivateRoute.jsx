import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadUser } from '../features/auth/authSlice';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (token && !isAuthenticated && !loading) {
        // If we have a token but not authenticated yet, try to load the user
        await dispatch(loadUser());
      }
      
      setAuthChecked(true);
    };
    
    checkAuthentication();
  }, [dispatch, isAuthenticated, loading, token]);

  // Only redirect to login after we've checked authentication status
  useEffect(() => {
    if (authChecked && !token && !loading && !isAuthenticated) {
      navigate('/login', { 
        state: { from: window.location.pathname },
        replace: true
      });
    }
  }, [authChecked, navigate, token, loading, isAuthenticated]);

  if (loading || !authChecked) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default PrivateRoute; 