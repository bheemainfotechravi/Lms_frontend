import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosinstance";

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forget_password", { email });
      return res.data?.message || "OTP sent";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify_otp", { email, otp });
      return res.data?.message || "OTP Verified";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
  }
);


export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, password, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/auth/reset_password", {
        email,
        password,
        otp,
      });
      return res.data?.message || "Password Reset Successful";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

export const updateTempPassword = createAsyncThunk(
  "auth/updateTempPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/auth/generate_password", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const initialState = {
  step: 1,

  sendOTPLoading: false,
  verifyOTPLoading: false,
  resetPasswordLoading: false,
  updatePasswordLoading: false,
  successMessage: null,
  error: null,
};


const authSlice = createSlice({
 name: "forgotPassword",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    resetAuthFlow: (state) => {
      state.step = 1;
      state.error = null;
      state.successMessage = null;
      state.sendOTPLoading = false;
      state.verifyOTPLoading = false;
      state.resetPasswordLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // SEND OTP
      .addCase(sendOTP.pending, (state) => {
        state.sendOTPLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.sendOTPLoading = false;
        state.successMessage = action.payload;
        state.step = 2;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.sendOTPLoading = false;
        state.error = action.payload;
      })

      // VERIFY OTP
      .addCase(verifyOTP.pending, (state) => {
        state.verifyOTPLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.verifyOTPLoading = false;
        state.successMessage = action.payload;
        state.step = 3;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.verifyOTPLoading = false;
        state.error = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.error = action.payload;
      })
      // Update Admin PASSWORD
      .addCase(updateTempPassword.pending, (state) => {
      state.updatePasswordLoading = true;
     })
     .addCase(updateTempPassword.fulfilled, (state, action) => {
     state.updatePasswordLoading = false;
     state.successMessage = "Password updated successfully!";
     })
    .addCase(updateTempPassword.rejected, (state, action) => {
    state.updatePasswordLoading = false;
    state.error = action.payload;
    });
  },
});

export const { setStep, resetAuthFlow } = authSlice.actions;
export default authSlice.reducer;