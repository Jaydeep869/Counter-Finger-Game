import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  
  // Log the error for debugging
  console.error("Application error:", error);

  const isNotFound = error?.status === 404 || error?.message?.includes('Not Found');
  
  return (
    <div className="error-page-container">
      <div className="error-card">
        <h1 className="error-title">
          {isNotFound ? "Page Not Found" : "Something Went Wrong"}
        </h1>
        
        <div className="error-code">
          {isNotFound ? "404" : error?.status || "Error"}
        </div>
        
        <p className="error-message">
          {isNotFound 
            ? "The page you're looking for doesn't exist or has been moved."
            : "We encountered an unexpected error. Please try again later."}
        </p>
        
        <div className="error-details">
          <p>{error?.data?.message || error?.message || ""}</p>
        </div>
        
        <div className="error-actions">
          <Link to="/" className="home-button">
            Return to Home
          </Link>
          
          <Link to="/game" className="game-button">
            Play Game
          </Link>
          
          {!localStorage.getItem('token') && (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 