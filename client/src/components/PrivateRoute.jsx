import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadUser } from '../features/auth/authSlice';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser());
    }
    
    if (!token && !loading) {
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, loading, navigate, token]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default PrivateRoute; 