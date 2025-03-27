import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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