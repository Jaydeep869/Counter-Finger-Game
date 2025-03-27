import axios from 'axios';

// Determine if the app is running on Vercel production
const isVercelProduction = 
  typeof window !== 'undefined' && 
  window.location && 
  (window.location.hostname.endsWith('vercel.app') || 
   window.location.hostname.includes('.vercel.app'));

// Get API URL from environment
const apiBaseURL = import.meta.env.VITE_API_URL || '/api';

// Create API client with baseURL
const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add longer timeout for potentially slow API responses
  timeout: 10000
});

// Log the API connection details
console.log(`API configured with base URL: ${apiBaseURL}`);
console.log(`Running on Vercel production: ${isVercelProduction}`);

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // In development, log the full request URL for debugging
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log errors in development or for debugging in production
    console.error(`❌ API Error:`, error.response || error);
    
    // Add detailed error information
    const errorResponse = {
      message: 'An error occurred during the API request',
      status: error.response?.status || 'unknown',
      originalError: error.message,
      url: error.config?.url || 'unknown endpoint',
      method: error.config?.method?.toUpperCase() || 'unknown method'
    };
    
    // Display error details in console for debugging
    console.error('API Request Failed:', errorResponse);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle not found errors (especially important for Vercel deployments)
    if (error.response && error.response.status === 404) {
      console.error('API endpoint not found. Please check your API configuration.');
      
      // If on Vercel and getting 404, log additional debugging info
      if (isVercelProduction) {
        console.error('Vercel deployment detected. Make sure vercel.json is properly configured for API routing.');
      }
    }
    
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.put('/auth/update', userData);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error.response?.data || error.message);
    throw error;
  }
};

export const saveScore = async (score) => {
  try {
    const response = await api.post('/scores', { score });
    return response.data;
  } catch (error) {
    console.error('Save score error:', error.response?.data || error.message);
    throw error;
  }
};

export const getLeaderboard = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/scores/leaderboard?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Get leaderboard error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserScores = async () => {
  try {
    const response = await api.get('/scores/user');
    return response.data;
  } catch (error) {
    console.error('Get user scores error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const response = await api.get('/scores/user/stats');
    return response.data;
  } catch (error) {
    console.error('Get user stats error:', error.response?.data || error.message);
    throw error;
  }
};

export default api; 