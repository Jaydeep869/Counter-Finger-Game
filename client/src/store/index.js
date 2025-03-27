import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import scoreReducer from '../features/game/scoreSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    score: scoreReducer,
  },
});

export default store; 