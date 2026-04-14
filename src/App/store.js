import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
     course: courseReducer,
  },
});

