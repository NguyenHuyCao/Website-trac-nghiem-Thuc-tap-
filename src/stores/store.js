import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/Auth/authSlice";
import quizReducer from "../features/quizz/quizzSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  },
});
