import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosinstance";



export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async () => {
    const res = await axiosInstance.get("/course/get");
    return res.data?.message?.courses || [];
  }
);

export const fetchCategories = createAsyncThunk(
  "course/fetchCategories",
  async () => {
    const res = await axiosInstance.get("/category/get");
    return res.data?.message?.categories || [];
  }
);

export const fetchCoursesByCategory = createAsyncThunk(
  "course/fetchCoursesByCategory",
  async (slug) => {
    const res = await axiosInstance.get(`/course/courses/${slug}`);
    return res.data?.message?.courses || [];
  }
);



const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    categories: [],
    categoryCourses: [],
    categoryLoading: false,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder

      
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch courses";
      })

      
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch categories";
      })
      .addCase(fetchCoursesByCategory.pending, (state) => {
  state.categoryLoading = true;
   })
  .addCase(fetchCoursesByCategory.fulfilled, (state, action) => {
  state.categoryLoading = false;
  state.categoryCourses = action.payload;
  })
   .addCase(fetchCoursesByCategory.rejected, (state) => {
  state.categoryLoading = false;
});
  },
});

export default courseSlice.reducer;