import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: "",
  brand: "",
  usecase: "",
};

export const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
    setUsecase: (state, action) => {
      state.usecase = action.payload;
    },
  },
});

export const { setCategory, setBrand, setUsecase } = querySlice.actions;

export default querySlice.reducer;