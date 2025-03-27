import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser as registerAPI, loginUser as loginAPI, getCurrentUser as getCurrentUserAPI, updateUser as updateUserAPI } from '../../services/api';

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerAPI(userData);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserAPI();
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load user');
    }
  }
);

export const updateUsername = createAsyncThunk(
  'auth/updateUsername',
  async (username, { rejectWithValue }) => {
    try {
      const response = await updateUserAPI({ username });
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update username');
    }
  }
);

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      return {
        ...initialState,
        token: null,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(updateUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 