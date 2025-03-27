import axios from 'axios';

// Create API client with baseURL from environment
const baseURL = import.meta.env.VITE_API_URL || 'https://counter-game-with-auth.onrender.com/api';
console.log('API baseURL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (error) => Promise.reject(error)
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
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error:`, error.response || error);
    }
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await api.put('/auth/update', userData);
  return response.data;
};

export const saveScore = async (score) => {
  const response = await api.post('/scores', { score });
  return response.data;
};

export const getLeaderboard = async (page = 1, limit = 10) => {
  const response = await api.get(`/scores/leaderboard?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserScores = async () => {
  const response = await api.get('/scores/user');
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get('/scores/user/stats');
  return response.data;
};

export default api; 