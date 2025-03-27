import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveScore as saveScoreAPI, getLeaderboard as getLeaderboardAPI, getUserScores as getUserScoresAPI, getUserStats as getUserStatsAPI } from '../../services/api';

// Async thunks
export const saveScore = createAsyncThunk(
  'score/saveScore',
  async (score, { rejectWithValue }) => {
    try {
      const response = await saveScoreAPI(score);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save score');
    }
  }
);

export const getLeaderboard = createAsyncThunk(
  'score/getLeaderboard',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await getLeaderboardAPI(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

export const getUserScores = createAsyncThunk(
  'score/getUserScores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserScoresAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user scores');
    }
  }
);

export const getUserStats = createAsyncThunk(
  'score/getUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserStatsAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stats');
    }
  }
);

// Initial state
const initialState = {
  currentScore: 0,
  leaderboard: [],
  userScores: [],
  userStats: {
    gamesPlayed: 0,
    highScore: 0,
    averageScore: 0,
    totalScore: 0
  },
  pagination: {
    total: 0,
    page: 1,
    pages: 1
  },
  loading: false,
  error: null,
};

// Score slice
const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    incrementScore: (state) => {
      state.currentScore += 1;
    },
    resetScore: (state) => {
      state.currentScore = 0;
    },
    clearScoreError: (state) => {
      state.error = null;
    },
    resetGameState: (state) => {
      state.currentScore = 0;
      state.leaderboard = [];
      state.userScores = [];
      state.userStats = {
        gamesPlayed: 0,
        highScore: 0,
        averageScore: 0,
        totalScore: 0
      };
      state.pagination = {
        total: 0,
        page: 1,
        pages: 1
      };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveScore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload.scores;
        state.pagination = action.payload.pagination;
      })
      .addCase(getLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserScores.fulfilled, (state, action) => {
        state.loading = false;
        state.userScores = action.payload.scores;
      })
      .addCase(getUserScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload.stats;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { incrementScore, resetScore, clearScoreError, resetGameState } = scoreSlice.actions;
export default scoreSlice.reducer; 