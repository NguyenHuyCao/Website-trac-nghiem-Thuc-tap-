// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import instance from "../../../src/utils/axiosCustomize";
// import { toast } from "react-toastify";

// // Thêm bài kiểm tra
// export const addQuiz = createAsyncThunk(
//   "quiz/addQuiz",
//   async (quizData, { rejectWithValue }) => {
//     try {
//       const response = await instance.post("api/v1/quizz/add", quizData);
//       return response.data; // Trả về dữ liệu từ API
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message ||
//           error.message ||
//           "Thêm bài kiểm tra thất bại. Vui lòng thử lại."
//       );
//     }
//   }
// );

// // Chỉnh sửa câu hỏi trong bài kiểm tra
// export const editQuiz = createAsyncThunk(
//   "quiz/editQuiz",
//   async ({ quizId, questionId, questionData }, { rejectWithValue }) => {
//     try {
//       const response = await instance.patch(
//         `api/v1/quizz/quizzes/${quizId}/questions/${questionId}`,
//         questionData
//       );
//       return { quizId, questionId, ...response.data }; // Trả về dữ liệu từ API
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message ||
//           error.message ||
//           "Chỉnh sửa câu hỏi thất bại. Vui lòng thử lại."
//       );
//     }
//   }
// );

// const quizSlice = createSlice({
//   name: "quiz",
//   initialState: {
//     quizzes: [], // Danh sách bài kiểm tra
//     addQuizLoading: false,
//     addQuizError: null,
//     editQuizLoading: false,
//     editQuizError: null,
//   },
//   reducers: {
//     resetAddQuizState: (state) => {
//       state.addQuizLoading = false;
//       state.addQuizError = null;
//     },
//     resetEditQuizState: (state) => {
//       state.editQuizLoading = false;
//       state.editQuizError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Thêm bài kiểm tra
//       .addCase(addQuiz.pending, (state) => {
//         state.addQuizLoading = true;
//         state.addQuizError = null;
//       })
//       .addCase(addQuiz.fulfilled, (state, action) => {
//         state.addQuizLoading = false;
//         state.quizzes.push(action.payload); // Cập nhật danh sách bài kiểm tra
//         toast.success("Thêm bài kiểm tra thành công!");
//       })
//       .addCase(addQuiz.rejected, (state, action) => {
//         state.addQuizLoading = false;
//         state.addQuizError = action.payload;
//         toast.error(state.addQuizError || "Thêm bài kiểm tra thất bại.");
//       })
//       // Chỉnh sửa câu hỏi
//       .addCase(editQuiz.pending, (state) => {
//         state.editQuizLoading = true;
//         state.editQuizError = null;
//       })
//       .addCase(editQuiz.fulfilled, (state, action) => {
//         state.editQuizLoading = false;
//         const { quizzId, questionId, ...updatedQuestion } = action.payload;

//         // Tìm bài kiểm tra
//         const quizIndex = state.quizzes.findIndex(
//           (quiz) => quiz.id === quizzId
//         );
//         if (quizIndex !== -1) {
//           // Tìm câu hỏi trong bài kiểm tra
//           const questionIndex = state.quizzes[quizIndex].questions.findIndex(
//             (question) => question.id === questionId
//           );
//           if (questionIndex !== -1) {
//             // Cập nhật câu hỏi
//             state.quizzes[quizIndex].questions[questionIndex] = updatedQuestion;
//           }
//         }

//         toast.success("Chỉnh sửa câu hỏi thành công!");
//       })
//       .addCase(editQuiz.rejected, (state, action) => {
//         state.editQuizLoading = false;
//         state.editQuizError = action.payload;
//         toast.error(state.editQuizError || "Chỉnh sửa câu hỏi thất bại.");
//       });
//   },
// });

// export const { resetAddQuizState, resetEditQuizState } = quizSlice.actions;
// export default quizSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../src/utils/axiosCustomize";
import { toast } from "react-toastify";

// Thêm bài kiểm tra
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

// Chỉnh sửa câu hỏi trong bài kiểm tra
export const editQuiz = createAsyncThunk(
  "quiz/editQuiz",
  async ({ quizId, questionId, questionData }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `api/v1/quizz/quizzes/${quizId}/questions/${questionId}`,
        questionData
      );
      return { quizId, questionId, ...response.data }; // Trả về dữ liệu từ API
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Chỉnh sửa câu hỏi thất bại. Vui lòng thử lại."
      );
    }
  }
);

// Thêm câu hỏi mới vào bài kiểm tra
export const addQuestion = createAsyncThunk(
  "quiz/addQuestion",
  async ({ quizId, questionData }, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `api/v1/quizz/quizzes/${quizId}/questions`,
        questionData
      );
      return { quizId, question: response.data }; // Trả về quizId và câu hỏi mới
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Thêm câu hỏi thất bại. Vui lòng thử lại."
      );
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [], // Danh sách bài kiểm tra
    addQuizLoading: false,
    addQuizError: null,
    editQuizLoading: false,
    editQuizError: null,
    addQuestionLoading: false,
    addQuestionError: null,
  },
  reducers: {
    resetAddQuizState: (state) => {
      state.addQuizLoading = false;
      state.addQuizError = null;
    },
    resetEditQuizState: (state) => {
      state.editQuizLoading = false;
      state.editQuizError = null;
    },
    resetAddQuestionState: (state) => {
      state.addQuestionLoading = false;
      state.addQuestionError = null;
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
      })
      // Chỉnh sửa câu hỏi
      .addCase(editQuiz.pending, (state) => {
        state.editQuizLoading = true;
        state.editQuizError = null;
      })
      .addCase(editQuiz.fulfilled, (state, action) => {
        state.editQuizLoading = false;
        const { quizId, questionId, ...updatedQuestion } = action.payload;

        // Tìm bài kiểm tra
        const quizIndex = state.quizzes.findIndex((quiz) => quiz.id === quizId);
        if (quizIndex !== -1) {
          // Tìm câu hỏi trong bài kiểm tra
          const questionIndex = state.quizzes[quizIndex].questions.findIndex(
            (question) => question.id === questionId
          );
          if (questionIndex !== -1) {
            // Cập nhật câu hỏi
            state.quizzes[quizIndex].questions[questionIndex] = updatedQuestion;
          }
        }

        toast.success("Chỉnh sửa câu hỏi thành công!");
      })
      .addCase(editQuiz.rejected, (state, action) => {
        state.editQuizLoading = false;
        state.editQuizError = action.payload;
        toast.error(state.editQuizError || "Chỉnh sửa câu hỏi thất bại.");
      })
      // Thêm câu hỏi
      .addCase(addQuestion.pending, (state) => {
        state.addQuestionLoading = true;
        state.addQuestionError = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.addQuestionLoading = false;
        const { quizId, question } = action.payload;

        // Tìm bài kiểm tra
        const quizIndex = state.quizzes.findIndex((quiz) => quiz.id === quizId);
        if (quizIndex !== -1) {
          // Thêm câu hỏi mới vào danh sách câu hỏi
          state.quizzes[quizIndex].questions.push(question);
        }

        toast.success("Thêm câu hỏi thành công!");
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.addQuestionLoading = false;
        state.addQuestionError = action.payload;
        toast.error(state.addQuestionError || "Thêm câu hỏi thất bại.");
      });
  },
});

export const { resetAddQuizState, resetEditQuizState, resetAddQuestionState } =
  quizSlice.actions;
export default quizSlice.reducer;
