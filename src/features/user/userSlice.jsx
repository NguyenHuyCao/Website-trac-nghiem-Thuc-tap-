import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api/apiConfig";

// Async thunk để lấy tất cả người dùng
export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk để thay đổi mật khẩu
export const changePassword = createAsyncThunk(
  'users/changePassword',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/change-password', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  changePasswordSuccess: false,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.changePasswordSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.changePasswordSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.changePasswordSuccess = false;
      });
  },
});

export default usersSlice.reducer;
