import { toast } from "react-toastify";
import instance from "../../../src/utils/axiosCustomize";
import "react-toastify/dist/ReactToastify.css";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Hàm đăng ký user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await instance.post("api/v1/user/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Hàm đăng nhập user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await instance.post("api/v1/user/login", formData);

      // Kiểm tra nếu response.user tồn tại
      if (response && response.user) {
        const token = response.user.token;
        if (token) {
          localStorage.setItem("access_token", token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return { token, user: response.user }; // Trả về token và user
      } else {
        throw new Error("Không tìm thấy thông tin người dùng trong phản hồi.");
      }
    } catch (error) {
      // Xử lý lỗi từ server
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  }
);
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("access_token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    profileBgColor: localStorage.getItem("profile_bg_color") || null,
    loginLoading: false,
    error: null,
    registerLoading: false,
    registerError: null,
    isAuthenticated: !!localStorage.getItem("access_token"),
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.token = action.payload.token;
      state.user = {
        username: action.payload.name,
        email: action.payload.email,
        role: "user",
      };
      state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(state.user));
      const randomColor = generateRandomColor();
      state.profileBgColor = randomColor;
      localStorage.setItem("profile_bg_color", randomColor);
    },
    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      state.loginLoading = false;
      state.isAuthenticated = false;
      state.error = null;
      state.registerError = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile_bg_color");

      window.location.href = "/";
      toast.success("Bạn đã đăng xuất");
    },
  },
  extraReducers: (builder) => {
    builder
      //Register User
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        toast.info("Vui lòng kiểm tra eamil để xác minh tài khoản");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
        toast.error(
          state.registerError || "Đăng ký thất bại. Vui lòng thử lại."
        );
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.token = action.payload.user.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // Tạo màu ngẫu nhiên khi đăng nhập
        const randomColor = generateRandomColor();
        state.profileBgColor = randomColor;
        localStorage.setItem("profile_bg_color", randomColor);
        toast.success("Đăng nhập thành công");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
        toast.error(state.error || "Đăng nhập thất bại. Vui lòng thử lại.");
      });
  },
});

export const { logoutUser, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
