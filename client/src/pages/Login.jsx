import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, clearError } from '../features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);
  
  // Get the intended destination from location state or default to '/game'
  const from = location.state?.from || '/';
  
  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to the original intended page or home if not specified
      navigate(from, { replace: true });
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch, from]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(login({ email, password }));
    }
  };
  
  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Login to Your Account</h2>
        
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className={`form-input ${formErrors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {formErrors.email && <p className="form-error-text">{formErrors.email}</p>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className={`form-input ${formErrors.password ? 'error' : ''}`}
              placeholder="Enter your password"
            />
            {formErrors.password && <p className="form-error-text">{formErrors.password}</p>}
          </div>
          
          <div>
            <button
              type="submit"
              className="form-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 