import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../src/utils/axiosCustomize";
import { toast } from "react-toastify";

// Hàm thêm bài kiểm tra
export const addQuiz = createAsyncThunk(
  "quiz/addQuiz",
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await instance.post("api/v1/quizz/add", quizData);

      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Thêm bài kiểm tra thất bại. Vui lòng thử lại."
      );
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [],
    addQuizLoading: false,
    addQuizError: null,
  },
  reducers: {
    resetAddQuizState: (state) => {
      state.addQuizLoading = false;
      state.addQuizError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Thêm bài kiểm tra
      .addCase(addQuiz.pending, (state) => {
        state.addQuizLoading = true;
        state.addQuizError = null;
      })
      .addCase(addQuiz.fulfilled, (state, action) => {
        state.addQuizLoading = false;
        state.quizzes.push(action.payload); // Cập nhật danh sách bài kiểm tra
        toast.success("Thêm bài kiểm tra thành công!");
      })
      .addCase(addQuiz.rejected, (state, action) => {
        state.addQuizLoading = false;
        state.addQuizError = action.payload;
        toast.error(state.addQuizError || "Thêm bài kiểm tra thất bại.");
      });
  },
});

export const { resetAddQuizState } = quizSlice.actions;
export default quizSlice.reducer;
