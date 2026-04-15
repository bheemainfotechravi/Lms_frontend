import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseslice';
import forgotPasswordReducer from '../features/RecoverPassword/forgotPasswordSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
     course: courseReducer,
    forgotPassword: forgotPasswordReducer 
  },
});

