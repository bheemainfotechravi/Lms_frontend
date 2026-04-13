import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosinstance';



export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/auth/student_register', formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Registration failed");
    }
  }
);



export const registerAdmin = createAsyncThunk(
  'auth/',
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/auth/user_register ', formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ credentials, role }, thunkAPI) => {
    try {
      const normalizedRole = role.toLowerCase().replace(/\s+/g, "");
      const endpointMap = {
        student: '/auth/student_login',
        teacher: '/auth/user_login ', 
        corporate: '/auth/user_login ', 
        superadmin: '/auth/admin_login',
      };

      const url = endpointMap[normalizedRole];
      if (!url) return thunkAPI.rejectWithValue("Invalid user role selected.");

      const res = await axiosInstance.post(url, credentials);
      const responseData = res.data.data || res.data;
      const { user, token } = responseData;

      if (token) {
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("authToken", token);
      }
      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Login failed.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error("Server logout failed, clearing local state anyway.");
    } finally {
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    }
  }
);



const getUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem("userData");
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      return JSON.parse(savedUser);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem("authToken") || null,
  user: getUserFromStorage(),
  isLoading: false,
  error: null,
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder 
      
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      
      .addCase(logoutUser.pending, (state) => { state.isLoading = true; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;



export const selectUserRole = (state) => {
  const role = state.auth.user?.role || "";
  return role.toLowerCase().replace(/\s+/g, "").trim(); 
};

export const selectIsSuperAdmin = (state) => selectUserRole(state) === "superadmin";
export const selectIsTeacher = (state) => selectUserRole(state) === "teacher";
export const selectIsStudent = (state) => selectUserRole(state) === "student";
export const selectIsCompany = (state) => selectUserRole(state) === "corporate";